
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

interface FormData {
  title: string;
  description: string;
  product_id: string;
  target_price: string;
  current_price: string;
  minimum_quantity: string;
  target_participants: string;
  location: string;
  expires_at: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const BulkOrderForm: React.FC<BulkOrderFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<FormData>({
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
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    // Product validation
    if (!formData.product_id) {
      errors.product_id = 'Product selection is required';
    }

    // Price validations
    const targetPrice = parseFloat(formData.target_price);
    const currentPrice = parseFloat(formData.current_price);
    
    if (!formData.target_price || isNaN(targetPrice) || targetPrice <= 0) {
      errors.target_price = 'Valid target price is required';
    }

    if (!formData.current_price || isNaN(currentPrice) || currentPrice <= 0) {
      errors.current_price = 'Valid current price is required';
    }

    if (targetPrice && currentPrice && targetPrice >= currentPrice) {
      errors.target_price = 'Target price must be lower than current price';
    }

    // Quantity validation
    const minQuantity = parseInt(formData.minimum_quantity);
    if (!formData.minimum_quantity || isNaN(minQuantity) || minQuantity <= 0) {
      errors.minimum_quantity = 'Valid minimum quantity is required';
    }

    // Participants validation
    const targetParticipants = parseInt(formData.target_participants);
    if (!formData.target_participants || isNaN(targetParticipants) || targetParticipants < 2) {
      errors.target_participants = 'Target participants must be at least 2';
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    // Expiry date validation
    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        errors.expires_at = 'Expiry date must be in the future';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a bulk order",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Calculate expires_at as 30 days from now if not provided
      const expiresAt = formData.expires_at || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { error } = await supabase
        .from('bulk_orders')
        .insert({
          creator_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          product_id: formData.product_id,
          target_price: parseFloat(formData.target_price),
          current_price: parseFloat(formData.current_price),
          minimum_quantity: parseInt(formData.minimum_quantity),
          target_participants: parseInt(formData.target_participants),
          location: formData.location.trim(),
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
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
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Bulk Rice Order for December"
                className={`font-semibold ${validationErrors.title ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.title && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-bold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your bulk order requirements..."
                className="font-semibold"
              />
            </div>

            <div>
              <Label className="text-sm font-bold">Product *</Label>
              <Select 
                value={formData.product_id} 
                onValueChange={(value) => handleInputChange('product_id', value)}
                required
              >
                <SelectTrigger className={`font-semibold ${validationErrors.product_id ? 'border-red-500' : ''}`}>
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
              {validationErrors.product_id && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.product_id}</p>
              )}
            </div>

            <div>
              <Label htmlFor="minimum_quantity" className="text-sm font-bold">
                Minimum Quantity * {selectedProduct && `(${selectedProduct.unit})`}
              </Label>
              <Input
                id="minimum_quantity"
                type="number"
                min="1"
                value={formData.minimum_quantity}
                onChange={(e) => handleInputChange('minimum_quantity', e.target.value)}
                placeholder="50"
                className={`font-semibold ${validationErrors.minimum_quantity ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.minimum_quantity && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.minimum_quantity}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_price" className="text-sm font-bold">Target Price * (₹/{selectedProduct?.unit || 'unit'})</Label>
                <Input
                  id="target_price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.target_price}
                  onChange={(e) => handleInputChange('target_price', e.target.value)}
                  placeholder="25.00"
                  className={`font-semibold ${validationErrors.target_price ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.target_price && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.target_price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="current_price" className="text-sm font-bold">Current Market Price * (₹/{selectedProduct?.unit || 'unit'})</Label>
                <Input
                  id="current_price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.current_price}
                  onChange={(e) => handleInputChange('current_price', e.target.value)}
                  placeholder="30.00"
                  className={`font-semibold ${validationErrors.current_price ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.current_price && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.current_price}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_participants" className="text-sm font-bold">Target Participants *</Label>
                <Input
                  id="target_participants"
                  type="number"
                  min="2"
                  value={formData.target_participants}
                  onChange={(e) => handleInputChange('target_participants', e.target.value)}
                  placeholder="10"
                  className={`font-semibold ${validationErrors.target_participants ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.target_participants && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.target_participants}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-bold">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Mumbai, Maharashtra"
                  className={`font-semibold ${validationErrors.location ? 'border-red-500' : ''}`}
                  required
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="expires_at" className="text-sm font-bold">Expiry Date (optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) => handleInputChange('expires_at', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`font-semibold ${validationErrors.expires_at ? 'border-red-500' : ''}`}
              />
              {validationErrors.expires_at && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.expires_at}</p>
              )}
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
