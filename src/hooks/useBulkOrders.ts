
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  const fetchBulkOrders = async () => {
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

      // Type cast the data to ensure proper typing
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
    } catch (err) {
      console.error('Error fetching bulk orders:', err);
      setError('Failed to fetch bulk orders');
    } finally {
      setLoading(false);
    }
  };

  const joinBulkOrder = async (bulkOrderId: string, quantity: number) => {
    if (!user) {
      console.error('User must be logged in to join bulk orders');
      return false;
    }

    try {
      const { error: insertError } = await supabase
        .from('bulk_order_participants')
        .insert([{
          bulk_order_id: bulkOrderId,
          user_id: user.id,
          quantity: quantity
        }]);

      if (insertError) {
        console.error('Error joining bulk order:', insertError);
        return false;
      }

      // Update current participants count using a proper RPC call or direct update
      const { error: updateError } = await supabase
        .from('bulk_orders')
        .update({ 
          current_participants: supabase.sql`current_participants + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', bulkOrderId);

      if (updateError) {
        console.error('Error updating participant count:', updateError);
      }

      // Refresh bulk orders
      await fetchBulkOrders();
      return true;
    } catch (err) {
      console.error('Error joining bulk order:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  return {
    bulkOrders,
    loading,
    error,
    joinBulkOrder,
    refetch: fetchBulkOrders
  };
};
