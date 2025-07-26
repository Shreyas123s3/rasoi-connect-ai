
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
  // Generate unique suppliers data based on specific product
  const getSuppliers = (product: string): Supplier[] => {
    const suppliersByProduct: Record<string, Supplier[]> = {
      'Onions': [
        { name: 'Maharashtra Onion Co.', quantity: '500kg', price: 40, rating: 4.8, location: 'Nashik', phone: '+91 98765 43210' },
        { name: 'Rajasthan Bulb Traders', quantity: '300kg', price: 44, rating: 4.5, location: 'Jodhpur', phone: '+91 87654 32109' },
        { name: 'Gujarat Onion Express', quantity: '250kg', price: 42, rating: 4.7, location: 'Rajkot', phone: '+91 76543 21098' },
        { name: 'Karnataka Red Onions', quantity: '400kg', price: 41, rating: 4.6, location: 'Belgaum', phone: '+91 65432 10987' }
      ],
      'Tomatoes': [
        { name: 'Andhra Fresh Tomatoes', quantity: '200kg', price: 33, rating: 4.9, location: 'Anantapur', phone: '+91 98765 11111' },
        { name: 'Karnataka Tomato Hub', quantity: '350kg', price: 36, rating: 4.4, location: 'Kolar', phone: '+91 87654 22222' },
        { name: 'Tamil Nadu Red Gold', quantity: '180kg', price: 34, rating: 4.8, location: 'Salem', phone: '+91 76543 33333' },
        { name: 'Maharashtra Tomato Co.', quantity: '280kg', price: 35, rating: 4.6, location: 'Pune', phone: '+91 65432 44444' }
      ],
      'Rice (Basmati)': [
        { name: 'Punjab Basmati Mills', quantity: '1000kg', price: 82, rating: 4.9, location: 'Amritsar', phone: '+91 98765 55555' },
        { name: 'Haryana Premium Rice', quantity: '800kg', price: 86, rating: 4.7, location: 'Karnal', phone: '+91 87654 66666' },
        { name: 'UP Basmati Traders', quantity: '1200kg', price: 84, rating: 4.8, location: 'Meerut', phone: '+91 76543 77777' },
        { name: 'Delhi Rice Exchange', quantity: '600kg', price: 88, rating: 4.5, location: 'Delhi', phone: '+91 65432 88888' }
      ],
      'Cooking Oil': [
        { name: 'Soybean Oil Syndicate', quantity: '50L cans', price: 175, rating: 4.6, location: 'Indore', phone: '+91 98765 99999' },
        { name: 'Sunflower Oil Corp', quantity: '30L cans', price: 182, rating: 4.4, location: 'Hyderabad', phone: '+91 87654 00000' },
        { name: 'Refined Oil Traders', quantity: '40L cans', price: 178, rating: 4.7, location: 'Ahmedabad', phone: '+91 76543 11112' },
        { name: 'Premium Oils Ltd', quantity: '25L cans', price: 185, rating: 4.5, location: 'Mumbai', phone: '+91 65432 22223' }
      ],
      'Turmeric Powder': [
        { name: 'Andhra Spice Mills', quantity: '50kg', price: 415, rating: 4.8, location: 'Guntur', phone: '+91 98765 33334' },
        { name: 'Tamil Turmeric Co.', quantity: '75kg', price: 425, rating: 4.6, location: 'Erode', phone: '+91 87654 44445' },
        { name: 'Karnataka Spice Hub', quantity: '60kg', price: 420, rating: 4.7, location: 'Mysore', phone: '+91 76543 55556' },
        { name: 'Maharashtra Spices', quantity: '40kg', price: 418, rating: 4.5, location: 'Kolhapur', phone: '+91 65432 66667' }
      ],
      'Wheat Flour': [
        { name: 'Punjab Flour Mills', quantity: '500kg', price: 30, rating: 4.7, location: 'Ludhiana', phone: '+91 98765 77778' },
        { name: 'Haryana Wheat Co.', quantity: '700kg', price: 33, rating: 4.5, location: 'Rohtak', phone: '+91 87654 88889' },
        { name: 'UP Flour Traders', quantity: '400kg', price: 31, rating: 4.8, location: 'Kanpur', phone: '+91 76543 99990' },
        { name: 'Rajasthan Mills Ltd', quantity: '600kg', price: 34, rating: 4.4, location: 'Jaipur', phone: '+91 65432 00001' }
      ],
      'Potatoes': [
        { name: 'UP Potato Syndicate', quantity: '800kg', price: 26, rating: 4.6, location: 'Agra', phone: '+91 98765 11112' },
        { name: 'Punjab Spud Co.', quantity: '1000kg', price: 29, rating: 4.8, location: 'Jalandhar', phone: '+91 87654 22223' },
        { name: 'West Bengal Potatoes', quantity: '600kg', price: 27, rating: 4.5, location: 'Hooghly', phone: '+91 76543 33334' },
        { name: 'Bihar Potato Hub', quantity: '900kg', price: 28, rating: 4.7, location: 'Patna', phone: '+91 65432 44445' }
      ],
      'Apples': [
        { name: 'Kashmir Apple Orchards', quantity: '200kg', price: 145, rating: 4.9, location: 'Srinagar', phone: '+91 98765 55556' },
        { name: 'Himachal Premium Fruits', quantity: '150kg', price: 152, rating: 4.7, location: 'Shimla', phone: '+91 87654 66667' },
        { name: 'Uttarakhand Apple Co.', quantity: '180kg', price: 148, rating: 4.8, location: 'Dehradun', phone: '+91 76543 77778' },
        { name: 'Punjab Apple Traders', quantity: '120kg', price: 155, rating: 4.6, location: 'Hoshiarpur', phone: '+91 65432 88889' }
      ]
    };

    // Get specific suppliers for the product, or default suppliers if product not found
    const productSuppliers = suppliersByProduct[product];
    
    if (productSuppliers) {
      return productSuppliers;
    }

    // Fallback suppliers for products not specifically defined
    return [
      { name: 'Local Fresh Suppliers', quantity: '100kg', price: 50, rating: 4.5, location: 'Mumbai', phone: '+91 98765 43210' },
      { name: 'Quality Produce Co.', quantity: '150kg', price: 48, rating: 4.7, location: 'Delhi', phone: '+91 87654 32109' },
      { name: 'Farm Direct Ltd.', quantity: '200kg', price: 52, rating: 4.6, location: 'Bangalore', phone: '+91 76543 21098' },
      { name: 'Premium Foods Inc.', quantity: '120kg', price: 55, rating: 4.8, location: 'Chennai', phone: '+91 65432 10987' }
    ];
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
