
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, User } from 'lucide-react';

interface Supplier {
  name: string;
  quantity: string;
  price: number;
  rating: number;
  location: string;
  phone: string;
}

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, productName }) => {
  // Mock suppliers data based on product
  const getSuppliers = (product: string): Supplier[] => {
    const baseSuppliers = [
      { name: 'Fresh Farms Co.', quantity: '100kg', price: 42, rating: 4.8, location: 'Mumbai', phone: '+91 98765 43210' },
      { name: 'Green Valley Suppliers', quantity: '250kg', price: 40, rating: 4.6, location: 'Pune', phone: '+91 87654 32109' },
      { name: 'Organic Direct', quantity: '150kg', price: 44, rating: 4.9, location: 'Delhi', phone: '+91 76543 21098' },
      { name: 'Farm Fresh Ltd.', quantity: '300kg', price: 39, rating: 4.5, location: 'Bangalore', phone: '+91 65432 10987' },
      { name: 'Quality Produce', quantity: '200kg', price: 43, rating: 4.7, location: 'Chennai', phone: '+91 54321 09876' }
    ];
    
    return baseSuppliers.slice(0, Math.floor(Math.random() * 2) + 4);
  };

  const suppliers = getSuppliers(productName);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-black">
            Available Suppliers for <span className="text-[#59D35D]">{productName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {suppliers.map((supplier, index) => (
            <Card key={index} className="border-2 border-wisteria/30 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-black">{supplier.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      {supplier.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">{supplier.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-gray-600">Available Quantity:</span>
                    <Badge className="bg-[#59D35D]/20 text-[#59D35D] font-bold">{supplier.quantity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-gray-600">Price Offered:</span>
                    <span className="font-black text-lg text-black">₹{supplier.price}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-gray-600">Contact:</span>
                    <span className="text-sm font-semibold text-gray-800">{supplier.phone}</span>
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
      </DialogContent>
    </Dialog>
  );
};

export default SupplierModal;
