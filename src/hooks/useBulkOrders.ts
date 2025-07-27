
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface BulkOrder {
  id: string;
  product_id: string;
  creator_id: string;
  supplier_id?: string;
  title: string;
  description?: string;
  current_price: number;
  target_price: number;
  minimum_quantity: number;
  current_participants: number;
  target_participants: number;
  location: string;
  expires_at: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useBulkOrders = () => {
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participationCache, setParticipationCache] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBulkOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bulk_orders')
        .select('*')
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching bulk orders:', fetchError);
        setError(fetchError.message);
        return;
      }

      const typedBulkOrders = (data || []).map(order => ({
        ...order,
        status: order.status as 'active' | 'completed' | 'cancelled',
        created_at: order.created_at || new Date().toISOString(),
        updated_at: order.updated_at || new Date().toISOString(),
        expires_at: order.expires_at || new Date().toISOString(),
        description: order.description || '',
        supplier_id: order.supplier_id || undefined,
        current_participants: order.current_participants || 0
      }));

      setBulkOrders(typedBulkOrders);

      // Batch check participation status for all orders
      if (user && typedBulkOrders.length > 0) {
        await batchCheckParticipation(typedBulkOrders.map(order => order.id));
      }
    } catch (err) {
      console.error('Error fetching bulk orders:', err);
      setError('Failed to fetch bulk orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const batchCheckParticipation = useCallback(async (orderIds: string[]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bulk_order_participants')
        .select('bulk_order_id')
        .eq('user_id', user.id)
        .in('bulk_order_id', orderIds);

      if (error) {
        console.error('Error checking participation:', error);
        return;
      }

      const newParticipationCache: { [key: string]: boolean } = {};
      orderIds.forEach(orderId => {
        newParticipationCache[orderId] = data?.some(p => p.bulk_order_id === orderId) || false;
      });

      setParticipationCache(newParticipationCache);
    } catch (error) {
      console.error('Error in batch participation check:', error);
    }
  }, [user]);

  const joinBulkOrder = useCallback(async (bulkOrderId: string, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to join bulk orders",
        variant: "destructive",
      });
      return false;
    }

    // Check cache first
    if (participationCache[bulkOrderId]) {
      toast({
        title: "Already Joined",
        description: "You have already joined this bulk order",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Double-check participation to prevent race conditions
      const { data: existingParticipation } = await supabase
        .from('bulk_order_participants')
        .select('id')
        .eq('bulk_order_id', bulkOrderId)
        .eq('user_id', user.id)
        .single();

      if (existingParticipation) {
        // Update cache
        setParticipationCache(prev => ({ ...prev, [bulkOrderId]: true }));
        toast({
          title: "Already Joined",
          description: "You have already joined this bulk order",
          variant: "destructive",
        });
        return false;
      }

      // Add the user to bulk_order_participants
      const { error: insertError } = await supabase
        .from('bulk_order_participants')
        .insert([{
          bulk_order_id: bulkOrderId,
          user_id: user.id,
          quantity: quantity
        }]);

      if (insertError) {
        console.error('Error joining bulk order:', insertError);
        toast({
          title: "Error",
          description: "Failed to join bulk order",
          variant: "destructive",
        });
        return false;
      }

      // Update participant count
      const { data: currentOrder } = await supabase
        .from('bulk_orders')
        .select('current_participants')
        .eq('id', bulkOrderId)
        .single();

      if (currentOrder) {
        const { error: updateError } = await supabase
          .from('bulk_orders')
          .update({ 
            current_participants: currentOrder.current_participants + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', bulkOrderId);

        if (updateError) {
          console.error('Error updating participant count:', updateError);
        }
      }

      // Update cache
      setParticipationCache(prev => ({ ...prev, [bulkOrderId]: true }));

      toast({
        title: "Success",
        description: "Successfully joined the bulk order!",
      });

      // Refresh bulk orders
      await fetchBulkOrders();
      return true;
    } catch (err) {
      console.error('Error joining bulk order:', err);
      toast({
        title: "Error",
        description: "Failed to join bulk order",
        variant: "destructive",
      });
      return false;
    }
  }, [user, participationCache, toast, fetchBulkOrders]);

  const checkUserParticipation = useCallback(async (bulkOrderId: string) => {
    if (!user) return false;

    // Return cached result if available
    if (participationCache[bulkOrderId] !== undefined) {
      return participationCache[bulkOrderId];
    }

    try {
      const { data } = await supabase
        .from('bulk_order_participants')
        .select('id')
        .eq('bulk_order_id', bulkOrderId)
        .eq('user_id', user.id)
        .single();

      const hasParticipated = !!data;
      
      // Update cache
      setParticipationCache(prev => ({ ...prev, [bulkOrderId]: hasParticipated }));
      
      return hasParticipated;
    } catch (error) {
      console.error('Error checking participation:', error);
      return false;
    }
  }, [user, participationCache]);

  useEffect(() => {
    fetchBulkOrders();
  }, [fetchBulkOrders]);

  const memoizedReturn = useMemo(() => ({
    bulkOrders,
    loading,
    error,
    joinBulkOrder,
    checkUserParticipation,
    refetch: fetchBulkOrders,
    participationStatus: participationCache
  }), [bulkOrders, loading, error, joinBulkOrder, checkUserParticipation, fetchBulkOrders, participationCache]);

  return memoizedReturn;
};
