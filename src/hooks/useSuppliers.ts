
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
  // Extended fields for map functionality
  lat?: number;
  lon?: number;
  status?: 'open' | 'closed';
  categories?: string[];
  distance?: number;
  price?: number;
  unit?: string;
  minimumOrder?: number;
  delivery?: boolean;
  pickup?: boolean;
  description?: string;
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

      // Transform the data to match our enhanced interface
      const enhancedSuppliers = (data || []).map(supplier => ({
        ...supplier,
        // Map database fields to our interface
        categories: supplier.specialties || [],
        price: 50, // Default price - in real app, this would come from supplier_products
        unit: 'kg',
        minimumOrder: 10,
        delivery: true,
        pickup: true,
        status: 'open' as const,
        lat: 19.076 + (Math.random() - 0.5) * 0.02, // Random location near Mumbai
        lon: 72.877 + (Math.random() - 0.5) * 0.02,
        description: 'Quality supplier with reliable service'
      }));

      setSuppliers(enhancedSuppliers);
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
