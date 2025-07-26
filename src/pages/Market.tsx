
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, MapPin, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { useAlerts } from '@/hooks/useAlerts';
import ConfettiAlert from '@/components/ConfettiAlert';

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showConfetti, setShowConfetti] = useState<string | null>(null);
  const { addAlert } = useAlerts();

  // Mock data for products - restored to show many products
  const products = [
    {
      id: '1',
      name: 'Basmati Rice',
      category: 'Grains',
      current_price: 85,
      price_change: 5.2,
      high_24h: 88,
      low_24h: 82,
      location: 'Delhi Wholesale Market'
    },
    {
      id: '2',
      name: 'Onions',
      category: 'Vegetables',
      current_price: 45,
      price_change: -2.1,
      high_24h: 48,
      low_24h: 43,
      location: 'Mumbai Market'
    },
    {
      id: '3',
      name: 'Tomatoes',
      category: 'Vegetables',
      current_price: 35,
      price_change: 8.5,
      high_24h: 38,
      low_24h: 32,
      location: 'Bangalore Market'
    },
    {
      id: '4',
      name: 'Wheat',
      category: 'Grains',
      current_price: 28,
      price_change: 1.2,
      high_24h: 29,
      low_24h: 27,
      location: 'Delhi Wholesale Market'
    },
    {
      id: '5',
      name: 'Mustard Oil',
      category: 'Oil',
      current_price: 120,
      price_change: -1.5,
      high_24h: 125,
      low_24h: 118,
      location: 'Kolkata Market'
    },
    {
      id: '6',
      name: 'Turmeric',
      category: 'Spices',
      current_price: 180,
      price_change: 3.8,
      high_24h: 185,
      low_24h: 175,
      location: 'Chennai Market'
    },
    {
      id: '7',
      name: 'Green Chilies',
      category: 'Vegetables',
      current_price: 60,
      price_change: 12.5,
      high_24h: 65,
      low_24h: 55,
      location: 'Hyderabad Market'
    },
    {
      id: '8',
      name: 'Coriander',
      category: 'Spices',
      current_price: 220,
      price_change: -3.2,
      high_24h: 230,
      low_24h: 210,
      location: 'Pune Market'
    },
    {
      id: '9',
      name: 'Coconut Oil',
      category: 'Oil',
      current_price: 140,
      price_change: 2.8,
      high_24h: 145,
      low_24h: 135,
      location: 'Kerala Market'
    },
    {
      id: '10',
      name: 'Potatoes',
      category: 'Vegetables',
      current_price: 25,
      price_change: -1.8,
      high_24h: 27,
      low_24h: 23,
      location: 'Punjab Market'
    },
    {
      id: '11',
      name: 'Red Lentils',
      category: 'Grains',
      current_price: 95,
      price_change: 4.2,
      high_24h: 98,
      low_24h: 90,
      location: 'Rajasthan Market'
    },
    {
      id: '12',
      name: 'Ginger',
      category: 'Spices',
      current_price: 80,
      price_change: 15.3,
      high_24h: 85,
      low_24h: 70,
      location: 'Karnataka Market'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleSetAlert = (productName: string, currentPrice: number) => {
    addAlert(productName, currentPrice);
    setShowConfetti(productName);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-black mb-4">
                MARKET <span className="text-[#59D35D]">PRICES</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Real-time market prices and trends for fresh produce
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-white/20 shadow-xl">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 font-semibold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="font-semibold">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Locations</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Market Data Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="bg-white/95 border-2 border-white/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-black text-black mb-2">
                      {product.name}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit bg-lemon/30 text-gray-800 font-semibold">
                      {product.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-black text-[#59D35D]">₹{product.current_price}/kg</div>
                        <div className="text-sm text-gray-500 font-semibold">Current Price</div>
                      </div>
                      <div className={`flex items-center ${product.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.price_change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-bold">{product.price_change >= 0 ? '+' : ''}{product.price_change}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 font-semibold">24h High:</span>
                        <span className="text-sm font-bold">₹{product.high_24h}/kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 font-semibold">24h Low:</span>
                        <span className="text-sm font-bold">₹{product.low_24h}/kg</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{product.location}</span>
                    </div>

                    <Button 
                      className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                      onClick={() => handleSetAlert(product.name, product.current_price)}
                    >
                      Set Price Alert
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {showConfetti && (
          <ConfettiAlert
            productName={showConfetti}
            onComplete={() => setShowConfetti(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default Market;
