
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SupabaseAlert {
  id: string;
  product_name: string;
  current_price: number;
  price_threshold: number;
  status: 'active' | 'triggered' | 'inactive';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useSupabaseAlerts = () => {
  const [alerts, setAlerts] = useState<SupabaseAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch alerts from Supabase
  const fetchAlerts = async () => {
    if (!user) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new alert
  const addAlert = async (productName: string, currentPrice: number, priceThreshold?: number) => {
    if (!user) {
      console.error('User must be logged in to add alerts');
      return null;
    }

    try {
      const newAlert = {
        product_name: productName,
        current_price: currentPrice,
        price_threshold: priceThreshold || currentPrice * 0.9,
        status: 'active' as const,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('alerts')
        .insert([newAlert])
        .select()
        .single();

      if (error) {
        console.error('Error adding alert:', error);
        return null;
      }

      // Update local state
      setAlerts(prevAlerts => [data, ...prevAlerts]);
      return data;
    } catch (error) {
      console.error('Error adding alert:', error);
      return null;
    }
  };

  // Delete an alert
  const deleteAlert = async (alertId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting alert:', error);
        return;
      }

      // Update local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  // Update alert status
  const updateAlertStatus = async (alertId: string, status: 'active' | 'triggered' | 'inactive') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('alerts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', alertId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alert:', error);
        return;
      }

      // Update local state
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, ...data } : alert
        )
      );
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  // Load alerts when user changes
  useEffect(() => {
    fetchAlerts();
  }, [user]);

  return {
    alerts,
    loading,
    addAlert,
    deleteAlert,
    updateAlertStatus,
    fetchAlerts
  };
};
