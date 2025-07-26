
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Supplier {
  id: string;
  user_id?: string;
  business_name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  location: string;
  rating: number;
  total_orders: number;
  specialties: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('suppliers')
        .select('*')
        .order('business_name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching suppliers:', fetchError);
        setError(fetchError.message);
        return;
      }

      setSuppliers(data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers
  };
};
