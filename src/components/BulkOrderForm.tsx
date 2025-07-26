
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { X, ShoppingCart, DollarSign, Calendar, MapPin, Package } from 'lucide-react';

interface BulkOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BulkOrderForm: React.FC<BulkOrderFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    current_price: '',
    target_price: '',
    minimum_quantity: '',
    target_participants: '',
    location: '',
    expires_at: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!formData.title || !formData.current_price || !formData.target_price || 
        !formData.minimum_quantity || !formData.target_participants || 
        !formData.location || !formData.expires_at) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      // Generate a product_id for now (in a real app, this would come from a products selection)
      const productId = crypto.randomUUID();

      const { error } = await supabase
        .from('bulk_orders')
        .insert([{
          product_id: productId,
          creator_id: user.id,
          title: formData.title,
          description: formData.description || null,
          current_price: parseFloat(formData.current_price),
          target_price: parseFloat(formData.target_price),
          minimum_quantity: parseInt(formData.minimum_quantity),
          current_participants: 1,
          target_participants: parseInt(formData.target_participants),
          location: formData.location,
          expires_at: new Date(formData.expires_at).toISOString(),
          status: 'active'
        }]);

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
        title: "Success!",
        description: "Bulk order created successfully",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating bulk order:', err);
      toast({
        title: "Error",
        description: "Failed to create bulk order",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/95 border-2 border-white/30 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-black text-black flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-[#59D35D]" />
            Create New Bulk Order
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Name *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Premium Basmati Rice"
                className="font-semibold"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-bold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Additional details about the product..."
                rows={3}
                className="font-semibold resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_price" className="text-sm font-bold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Current Price (₹/kg) *
                </Label>
                <Input
                  id="current_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.current_price}
                  onChange={(e) => handleChange('current_price', e.target.value)}
                  placeholder="100.00"
                  className="font-semibold"
                  required
                />
              </div>
              <div>
                <Label htmlFor="target_price" className="text-sm font-bold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Target Price (₹/kg) *
                </Label>
                <Input
                  id="target_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.target_price}
                  onChange={(e) => handleChange('target_price', e.target.value)}
                  placeholder="85.00"
                  className="font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimum_quantity" className="text-sm font-bold">
                  Minimum Quantity (kg) *
                </Label>
                <Input
                  id="minimum_quantity"
                  type="number"
                  min="1"
                  value={formData.minimum_quantity}
                  onChange={(e) => handleChange('minimum_quantity', e.target.value)}
                  placeholder="50"
                  className="font-semibold"
                  required
                />
              </div>
              <div>
                <Label htmlFor="target_participants" className="text-sm font-bold">
                  Target Participants *
                </Label>
                <Input
                  id="target_participants"
                  type="number"
                  min="2"
                  value={formData.target_participants}
                  onChange={(e) => handleChange('target_participants', e.target.value)}
                  placeholder="10"
                  className="font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Pickup Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Delhi Wholesale Market"
                className="font-semibold"
                required
              />
            </div>

            <div>
              <Label htmlFor="expires_at" className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expiry Date & Time *
              </Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => handleChange('expires_at', e.target.value)}
                className="font-semibold"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 font-bold border-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Bulk Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOrderForm;
