
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  unit: string;
}

interface BulkOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkOrderForm: React.FC<BulkOrderFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_id: '',
    target_price: '',
    current_price: '',
    minimum_quantity: '',
    target_participants: '',
    location: '',
    expires_at: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, unit')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Calculate expires_at as 30 days from now if not provided
      const expiresAt = formData.expires_at || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { error } = await supabase
        .from('bulk_orders')
        .insert({
          creator_id: user.id,
          title: formData.title,
          description: formData.description,
          product_id: formData.product_id,
          target_price: parseFloat(formData.target_price),
          current_price: parseFloat(formData.current_price),
          minimum_quantity: parseInt(formData.minimum_quantity),
          target_participants: parseInt(formData.target_participants),
          location: formData.location,
          expires_at: expiresAt + 'T23:59:59.999Z',
          status: 'active'
        });

      if (error) {
        console.error('Error creating bulk order:', error);
        toast({
          title: "Error",
          description: "Failed to create bulk order",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Bulk order created successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating bulk order:', error);
      toast({
        title: "Error",
        description: "Failed to create bulk order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.product_id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-black text-black">Start New Bulk Order</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-bold">Order Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Bulk Rice Order for December"
                className="font-semibold"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-bold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your bulk order requirements..."
                className="font-semibold"
              />
            </div>

            <div>
              <Label className="text-sm font-bold">Product *</Label>
              <Select 
                value={formData.product_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                required
              >
                <SelectTrigger className="font-semibold">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minimum_quantity" className="text-sm font-bold">
                Minimum Quantity * {selectedProduct && `(${selectedProduct.unit})`}
              </Label>
              <Input
                id="minimum_quantity"
                type="number"
                value={formData.minimum_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, minimum_quantity: e.target.value }))}
                placeholder="50"
                className="font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_price" className="text-sm font-bold">Target Price * (₹/{selectedProduct?.unit || 'unit'})</Label>
                <Input
                  id="target_price"
                  type="number"
                  step="0.01"
                  value={formData.target_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_price: e.target.value }))}
                  placeholder="25.00"
                  className="font-semibold"
                  required
                />
              </div>

              <div>
                <Label htmlFor="current_price" className="text-sm font-bold">Current Market Price * (₹/{selectedProduct?.unit || 'unit'})</Label>
                <Input
                  id="current_price"
                  type="number"
                  step="0.01"
                  value={formData.current_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_price: e.target.value }))}
                  placeholder="30.00"
                  className="font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_participants" className="text-sm font-bold">Target Participants *</Label>
                <Input
                  id="target_participants"
                  type="number"
                  value={formData.target_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_participants: e.target.value }))}
                  placeholder="10"
                  className="font-semibold"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-bold">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Mumbai, Maharashtra"
                  className="font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expires_at" className="text-sm font-bold">Expiry Date (optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to set expiry to 30 days from now</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
              >
                {loading ? 'Creating...' : 'Create Bulk Order'}
              </Button>
              
              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOrderForm;
