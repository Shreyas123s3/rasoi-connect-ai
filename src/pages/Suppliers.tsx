
import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Shield, Clock, MapPin, Truck, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const categories = ['All', 'Vegetables', 'Spices', 'Grains', 'Oils', 'Dairy', 'Meat'];

  const suppliers = [
    {
      id: 1,
      name: 'Mumbai Fresh Produce Co.',
      category: 'Vegetables',
      rating: 4.8,
      trustScore: 95,
      verified: true,
      distance: '2.3 km',
      deliveryTime: '2-4 hours',
      minOrder: '₹500',
      specialties: ['Onions', 'Tomatoes', 'Potatoes'],
      badges: ['FSSAI Verified', 'Government Registered'],
      image: '/placeholder.svg',
      reviews: 324,
      savings: '25%',
      phone: '+91 9876543210',
      products: [
        { name: 'Fresh Onions', price: '₹25/kg', packSize: '1kg', stock: '500kg' },
        { name: 'Tomatoes', price: '₹35/kg', packSize: '1kg', stock: '300kg' },
        { name: 'Potatoes', price: '₹20/kg', packSize: '1kg', stock: '800kg' },
        { name: 'Carrots', price: '₹40/kg', packSize: '1kg', stock: '200kg' }
      ]
    },
    {
      id: 2,
      name: 'Spice Masters India',
      category: 'Spices',
      rating: 4.9,
      trustScore: 98,
      verified: true,
      distance: '1.8 km',
      deliveryTime: '1-3 hours',
      minOrder: '₹300',
      specialties: ['Turmeric', 'Chili Powder', 'Garam Masala'],
      badges: ['FSSAI Verified', 'ISO Certified'],
      image: '/placeholder.svg',
      reviews: 456,
      savings: '30%',
      phone: '+91 9823456789',
      products: [
        { name: 'Turmeric Powder', price: '₹180/kg', packSize: '500g', stock: '150kg' },
        { name: 'Red Chili Powder', price: '₹220/kg', packSize: '500g', stock: '200kg' },
        { name: 'Garam Masala', price: '₹350/kg', packSize: '250g', stock: '100kg' },
        { name: 'Cumin Seeds', price: '₹280/kg', packSize: '500g', stock: '80kg' }
      ]
    },
    {
      id: 3,
      name: 'Golden Grain Suppliers',
      category: 'Grains',
      rating: 4.7,
      trustScore: 92,
      verified: true,
      distance: '3.1 km',
      deliveryTime: '3-6 hours',
      minOrder: '₹1000',
      specialties: ['Wheat', 'Rice', 'Pulses'],
      badges: ['FSSAI Verified', 'Organic Certified'],
      image: '/placeholder.svg',
      reviews: 278,
      savings: '20%',
      phone: '+91 9834567890',
      products: [
        { name: 'Basmati Rice', price: '₹120/kg', packSize: '5kg', stock: '2000kg' },
        { name: 'Wheat Flour', price: '₹40/kg', packSize: '10kg', stock: '1500kg' },
        { name: 'Toor Dal', price: '₹85/kg', packSize: '1kg', stock: '500kg' },
        { name: 'Moong Dal', price: '₹95/kg', packSize: '1kg', stock: '400kg' }
      ]
    },
    {
      id: 4,
      name: 'Pure Oil Trading',
      category: 'Oils',
      rating: 4.6,
      trustScore: 88,
      verified: true,
      distance: '4.2 km',
      deliveryTime: '4-8 hours',
      minOrder: '₹800',
      specialties: ['Cooking Oil', 'Mustard Oil', 'Coconut Oil'],
      badges: ['FSSAI Verified'],
      image: '/placeholder.svg',
      reviews: 189,
      savings: '18%',
      phone: '+91 9845678901',
      products: [
        { name: 'Sunflower Oil', price: '₹140/L', packSize: '1L', stock: '300L' },
        { name: 'Mustard Oil', price: '₹160/L', packSize: '1L', stock: '200L' },
        { name: 'Coconut Oil', price: '₹180/L', packSize: '500ml', stock: '150L' },
        { name: 'Groundnut Oil', price: '₹150/L', packSize: '1L', stock: '250L' }
      ]
    },
    {
      id: 5,
      name: 'Green Valley Farms',
      category: 'Vegetables',
      rating: 4.5,
      trustScore: 90,
      verified: true,
      distance: '2.8 km',
      deliveryTime: '2-5 hours',
      minOrder: '₹600',
      specialties: ['Leafy Greens', 'Organic Vegetables', 'Seasonal Produce'],
      badges: ['FSSAI Verified', 'Organic Certified'],
      image: '/placeholder.svg',
      reviews: 245,
      savings: '22%',
      phone: '+91 9856789012',
      products: [
        { name: 'Spinach', price: '₹30/kg', packSize: '250g', stock: '100kg' },
        { name: 'Cauliflower', price: '₹25/kg', packSize: '1pc', stock: '200pc' },
        { name: 'Broccoli', price: '₹60/kg', packSize: '500g', stock: '80kg' },
        { name: 'Cabbage', price: '₹20/kg', packSize: '1pc', stock: '150pc' }
      ]
    },
    {
      id: 6,
      name: 'Himalayan Spice Co.',
      category: 'Spices',
      rating: 4.8,
      trustScore: 94,
      verified: true,
      distance: '3.5 km',
      deliveryTime: '3-5 hours',
      minOrder: '₹400',
      specialties: ['Whole Spices', 'Cardamom', 'Saffron'],
      badges: ['FSSAI Verified', 'Export Quality'],
      image: '/placeholder.svg',
      reviews: 356,
      savings: '28%',
      phone: '+91 9867890123',
      products: [
        { name: 'Green Cardamom', price: '₹1200/kg', packSize: '100g', stock: '25kg' },
        { name: 'Black Pepper', price: '₹450/kg', packSize: '250g', stock: '60kg' },
        { name: 'Cloves', price: '₹800/kg', packSize: '100g', stock: '20kg' },
        { name: 'Cinnamon Sticks', price: '₹350/kg', packSize: '250g', stock: '40kg' }
      ]
    },
    {
      id: 7,
      name: 'Dairy Fresh Solutions',
      category: 'Dairy',
      rating: 4.4,
      trustScore: 87,
      verified: true,
      distance: '1.9 km',
      deliveryTime: '1-2 hours',
      minOrder: '₹300',
      specialties: ['Fresh Milk', 'Paneer', 'Yogurt'],
      badges: ['FSSAI Verified', 'ISO Certified'],
      image: '/placeholder.svg',
      reviews: 412,
      savings: '15%',
      phone: '+91 9878901234',
      products: [
        { name: 'Fresh Milk', price: '₹55/L', packSize: '1L', stock: '500L' },
        { name: 'Paneer', price: '₹280/kg', packSize: '200g', stock: '100kg' },
        { name: 'Greek Yogurt', price: '₹80/kg', packSize: '500g', stock: '200kg' },
        { name: 'Butter', price: '₹450/kg', packSize: '100g', stock: '50kg' }
      ]
    },
    {
      id: 8,
      name: 'Prime Meat Supply',
      category: 'Meat',
      rating: 4.6,
      trustScore: 91,
      verified: true,
      distance: '2.6 km',
      deliveryTime: '2-4 hours',
      minOrder: '₹700',
      specialties: ['Fresh Chicken', 'Mutton', 'Fish'],
      badges: ['FSSAI Verified', 'Halal Certified'],
      image: '/placeholder.svg',
      reviews: 298,
      savings: '20%',
      phone: '+91 9889012345',
      products: [
        { name: 'Fresh Chicken', price: '₹180/kg', packSize: '1kg', stock: '300kg' },
        { name: 'Mutton', price: '₹550/kg', packSize: '500g', stock: '150kg' },
        { name: 'Fish (Rohu)', price: '₹220/kg', packSize: '1kg', stock: '200kg' },
        { name: 'Prawns', price: '₹400/kg', packSize: '250g', stock: '80kg' }
      ]
    },
    {
      id: 9,
      name: 'Organic Harvest Co.',
      category: 'Vegetables',
      rating: 4.7,
      trustScore: 93,
      verified: true,
      distance: '3.8 km',
      deliveryTime: '3-6 hours',
      minOrder: '₹800',
      specialties: ['Organic Vegetables', 'Herbs', 'Microgreens'],
      badges: ['FSSAI Verified', 'Organic Certified', 'Pesticide Free'],
      image: '/placeholder.svg',
      reviews: 187,
      savings: '24%',
      phone: '+91 9890123456',
      products: [
        { name: 'Organic Tomatoes', price: '₹45/kg', packSize: '500g', stock: '200kg' },
        { name: 'Fresh Basil', price: '₹60/kg', packSize: '100g', stock: '50kg' },
        { name: 'Microgreens Mix', price: '₹120/kg', packSize: '200g', stock: '30kg' },
        { name: 'Organic Cucumber', price: '₹35/kg', packSize: '500g', stock: '150kg' }
      ]
    },
    {
      id: 10,
      name: 'Heritage Grains Ltd.',
      category: 'Grains',
      rating: 4.5,
      trustScore: 89,
      verified: true,
      distance: '4.1 km',
      deliveryTime: '4-7 hours',
      minOrder: '₹1200',
      specialties: ['Ancient Grains', 'Millets', 'Quinoa'],
      badges: ['FSSAI Verified', 'Organic Certified'],
      image: '/placeholder.svg',
      reviews: 156,
      savings: '19%',
      phone: '+91 9901234567',
      products: [
        { name: 'Quinoa', price: '₹320/kg', packSize: '500g', stock: '120kg' },
        { name: 'Finger Millet', price: '₹85/kg', packSize: '1kg', stock: '300kg' },
        { name: 'Pearl Millet', price: '₹75/kg', packSize: '1kg', stock: '250kg' },
        { name: 'Amaranth', price: '₹140/kg', packSize: '500g', stock: '180kg' }
      ]
    },
    {
      id: 11,
      name: 'Coastal Oil Mills',
      category: 'Oils',
      rating: 4.3,
      trustScore: 85,
      verified: true,
      distance: '5.2 km',
      deliveryTime: '5-8 hours',
      minOrder: '₹900',
      specialties: ['Cold Pressed Oils', 'Sesame Oil', 'Coconut Oil'],
      badges: ['FSSAI Verified', 'Cold Pressed'],
      image: '/placeholder.svg',
      reviews: 234,
      savings: '16%',
      phone: '+91 9912345678',
      products: [
        { name: 'Cold Pressed Coconut Oil', price: '₹220/L', packSize: '500ml', stock: '180L' },
        { name: 'Sesame Oil', price: '₹280/L', packSize: '500ml', stock: '120L' },
        { name: 'Castor Oil', price: '₹150/L', packSize: '250ml', stock: '80L' },
        { name: 'Almond Oil', price: '₹850/L', packSize: '100ml', stock: '25L' }
      ]
    },
    {
      id: 12,
      name: 'Rajasthani Spice House',
      category: 'Spices',
      rating: 4.9,
      trustScore: 96,
      verified: true,
      distance: '2.1 km',
      deliveryTime: '2-3 hours',
      minOrder: '₹350',
      specialties: ['Regional Spices', 'Spice Blends', 'Dry Fruits'],
      badges: ['FSSAI Verified', 'Traditional Methods', 'Export Quality'],
      image: '/placeholder.svg',
      reviews: 423,
      savings: '32%',
      phone: '+91 9923456789',
      products: [
        { name: 'Rajasthani Garam Masala', price: '₹380/kg', packSize: '200g', stock: '90kg' },
        { name: 'Dry Red Chilies', price: '₹320/kg', packSize: '500g', stock: '160kg' },
        { name: 'Coriander Seeds', price: '₹180/kg', packSize: '500g', stock: '220kg' },
        { name: 'Fennel Seeds', price: '₹240/kg', packSize: '250g', stock: '140kg' }
      ]
    }
  ];

  const filteredSuppliers = suppliers
    .filter(supplier => 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(supplier => 
      selectedCategory === 'All' || supplier.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'trustScore':
          return b.trustScore - a.trustScore;
        default:
          return 0;
      }
    });

  const handleViewProducts = (supplier) => {
    setSelectedSupplier(supplier);
    setShowProductsModal(true);
  };

  const handleContact = (supplier) => {
    setSelectedSupplier(supplier);
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon to-[#FDFDCR] overflow-y-auto">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header - Enhanced with Wisteria accents */}
          <div className="text-center mb-12 bg-wisteria/10 backdrop-blur-sm rounded-3xl py-12 px-6 border-2 border-wisteria/20">
            <h1 className="text-5xl font-black text-wisteria mb-4">
              TRUSTED <span className="text-[#59D35D]">SUPPLIERS</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-semibold">
              Discover verified suppliers with the best prices and fastest delivery in your area
            </p>
          </div>

          {/* Search and Filters - Enhanced with Lemon background */}
          <div className="bg-lemon backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-wisteria/30 shadow-lg">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-wisteria" />
                <Input
                  placeholder="Search suppliers or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-semibold border-2 border-wisteria/20 focus:border-wisteria"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-wisteria/20 font-semibold bg-white focus:border-wisteria"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-wisteria/20 font-semibold bg-white focus:border-wisteria"
              >
                <option value="rating">Sort by Rating</option>
                <option value="distance">Sort by Distance</option>
                <option value="trustScore">Sort by Trust Score</option>
              </select>
              
              <Button className="bg-wisteria hover:bg-wisteria/90 text-white font-bold border-2 border-wisteria">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Results Count - Enhanced with Wisteria styling */}
          <div className="mb-6 bg-wisteria/5 rounded-xl p-4 border border-wisteria/20">
            <p className="text-lg font-black text-wisteria">
              Showing {filteredSuppliers.length} verified suppliers
            </p>
          </div>

          {/* Suppliers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <Card key={supplier.id} className="bg-white border-2 border-wisteria/20 hover:shadow-xl hover:scale-105 hover:border-wisteria transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3 bg-lemon/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-black text-black mb-2">
                        {supplier.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-sm ml-1">{supplier.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({supplier.reviews})</span>
                        </div>
                        {supplier.verified && (
                          <Shield className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-right bg-wisteria/10 rounded-lg p-2">
                      <div className="text-2xl font-black text-wisteria">
                        {supplier.trustScore}%
                      </div>
                      <div className="text-xs text-wisteria font-semibold">Trust Score</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {supplier.badges.map(badge => (
                      <Badge key={badge} className="bg-green-100 text-green-800 text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Specialties */}
                  <div className="mb-3">
                    <div className="text-sm font-bold text-wisteria mb-1">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs border-wisteria/30 text-wisteria">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-wisteria mr-2" />
                      <span className="font-semibold">{supplier.distance}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-wisteria mr-2" />
                      <span className="font-semibold">{supplier.deliveryTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-wisteria mr-2" />
                      <span className="font-semibold">Min: {supplier.minOrder}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-green-600">{supplier.savings} savings</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleViewProducts(supplier)}
                      className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                    >
                      View Products
                    </Button>
                    <Button 
                      onClick={() => handleContact(supplier)}
                      variant="outline" 
                      className="border-2 border-wisteria/30 font-bold text-wisteria hover:bg-wisteria hover:text-white"
                    >
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More - Enhanced with Wisteria styling */}
          <div className="text-center mt-12 bg-lemon/30 rounded-2xl py-8 border-2 border-wisteria/20">
            <Button size="lg" className="bg-wisteria hover:bg-wisteria/90 text-white font-bold px-8 py-4 shadow-lg">
              Load More Suppliers
            </Button>
          </div>
        </div>
      </div>

      {/* Products Modal */}
      <Dialog open={showProductsModal} onOpenChange={setShowProductsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black flex items-center gap-2">
              <Package className="h-6 w-6 text-[#59D35D]" />
              Products from {selectedSupplier?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {selectedSupplier?.products?.map((product, index) => (
              <Card key={index} className="border-2 border-wisteria/20 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-black text-lg text-black mb-2">{product.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Price:</span>
                      <span className="font-black text-[#59D35D]">{product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Pack Size:</span>
                      <span className="font-semibold text-black">{product.packSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-600">Stock Left:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {product.stock}
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-wisteria hover:bg-wisteria/90 text-white font-bold">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black text-center">
              Contact {selectedSupplier?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="bg-[#59D35D]/10 rounded-2xl p-8 mb-6">
              <div className="text-4xl font-black text-black mb-2">
                {selectedSupplier?.phone}
              </div>
              <p className="text-sm text-gray-600 font-semibold">
                Tap to call or save this number
              </p>
            </div>
            <Button 
              onClick={() => setShowContactModal(false)}
              className="bg-wisteria hover:bg-wisteria/90 text-white font-bold px-8"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
