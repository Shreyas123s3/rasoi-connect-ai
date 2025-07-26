import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Shield, Clock, MapPin, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

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
      savings: '25%'
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
      savings: '30%'
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
      savings: '20%'
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
      savings: '18%'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon to-[#FDFDCR]">
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
                    <Button className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                      View Products
                    </Button>
                    <Button variant="outline" className="border-2 border-wisteria/30 font-bold text-wisteria hover:bg-wisteria hover:text-white">
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
    </div>
  );
};

export default Suppliers;
