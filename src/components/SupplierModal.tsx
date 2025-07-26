
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, User, Loader2 } from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, productName }) => {
  const { suppliers, loading } = useSuppliers();
  const [filteredSuppliers, setFilteredSuppliers] = useState<typeof suppliers>([]);

  useEffect(() => {
    if (suppliers.length > 0) {
      // Filter suppliers based on product category or show all if no specific match
      const productCategory = getProductCategory(productName);
      const filtered = suppliers.filter(supplier => 
        supplier.specialties.some(specialty => 
          specialty.toLowerCase().includes(productCategory.toLowerCase()) ||
          productCategory.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      
      // If no specific suppliers found, show all verified suppliers
      setFilteredSuppliers(filtered.length > 0 ? filtered : suppliers.filter(s => s.verified));
    }
  }, [suppliers, productName]);

  const getProductCategory = (product: string): string => {
    const categoryMap: Record<string, string> = {
      'onions': 'vegetables',
      'tomatoes': 'vegetables',
      'potatoes': 'vegetables',
      'rice': 'grains',
      'wheat': 'grains',
      'oil': 'oil',
      'cooking oil': 'oil',
      'turmeric': 'spices',
      'spices': 'spices',
      'paneer': 'dairy',
      'milk': 'dairy'
    };
    
    const lowerProduct = product.toLowerCase();
    for (const [key, category] of Object.entries(categoryMap)) {
      if (lowerProduct.includes(key)) {
        return category;
      }
    }
    return 'grocery';
  };

  const generatePrice = (supplierIndex: number, basePrice: number = 50): number => {
    // Generate consistent prices based on supplier index and product
    const variation = (supplierIndex * 7) % 20 - 10; // -10 to +10 variation
    return Math.max(basePrice + variation, 20);
  };

  const generateQuantity = (supplierIndex: number): string => {
    const quantities = ['100kg', '150kg', '200kg', '250kg', '300kg', '400kg', '500kg'];
    return quantities[supplierIndex % quantities.length];
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black">
              Finding Suppliers for <span className="text-[#59D35D]">{productName}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#59D35D]" />
            <span className="ml-2 text-lg font-semibold">Loading suppliers...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black">
            Available Suppliers for <span className="text-[#59D35D]">{productName}</span>
          </DialogTitle>
        </DialogHeader>
        
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-600 mb-2">No Suppliers Found</h3>
            <p className="text-gray-500">We couldn't find any suppliers for this product at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {filteredSuppliers.map((supplier, index) => (
              <Card key={supplier.id} className="border-2 border-wisteria/30 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-black text-black">{supplier.business_name}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <User className="h-4 w-4 mr-1" />
                        {supplier.location}
                      </p>
                      {supplier.contact_person && (
                        <p className="text-xs text-gray-500 mt-1">
                          Contact: {supplier.contact_person}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-sm">{supplier.rating.toFixed(1)}</span>
                      </div>
                      {supplier.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Available Quantity:</span>
                      <Badge className="bg-[#59D35D]/20 text-[#59D35D] font-bold">
                        {generateQuantity(index)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Price Offered:</span>
                      <span className="font-black text-lg text-black">
                        ₹{generatePrice(index)}/kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Contact:</span>
                      <span className="text-sm font-semibold text-gray-800">{supplier.phone}</span>
                    </div>
                    {supplier.specialties && supplier.specialties.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-600">Specialties:</span>
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {supplier.specialties.slice(0, 2).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Total Orders:</span>
                      <span className="text-sm font-semibold text-gray-800">{supplier.total_orders}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" className="border-2 border-wisteria/50 font-bold hover:bg-wisteria/10">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupplierModal;
