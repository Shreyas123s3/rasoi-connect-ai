import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Star, Shield, Clock, MapPin, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EnhancedNavbar from '@/components/EnhancedNavbar';

gsap.registerPlugin(ScrollTrigger);

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const suppliersRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { y: 100, opacity: 0, scale: 0.8 });

      ScrollTrigger.batch(cardsRef.current, {
        onEnter: (elements) => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
          });
        },
        start: "top 80%",
        end: "bottom 20%"
      });
    }, suppliersRef);

    return () => ctx.revert();
  }, [filteredSuppliers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR]">
      <EnhancedNavbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-black text-black mb-4">
              TRUSTED <span className="text-[#59D35D] animate-glow-pulse">SUPPLIERS</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover verified suppliers with the best prices and fastest delivery in your area
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card bg-white/90 backdrop-blur-sm shadow-xl border-2 border-gray-100 p-6 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search suppliers or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10 font-semibold rounded-2xl"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered w-full font-semibold rounded-2xl"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full font-semibold rounded-2xl"
              >
                <option value="rating">Sort by Rating</option>
                <option value="distance">Sort by Distance</option>
                <option value="trustScore">Sort by Trust Score</option>
              </select>
              
              <Button className="btn btn-primary rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-lg font-bold text-gray-700">
              Showing {filteredSuppliers.length} verified suppliers
            </p>
          </motion.div>

          <div ref={suppliersRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSuppliers.map((supplier, index) => (
                <motion.div
                  key={supplier.id}
                  ref={el => cardsRef.current[index] = el!}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -100, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="perspective-1000"
                >
                  <Card className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden h-full">
                    <CardHeader className="pb-3">
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
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Shield className="h-4 w-4 text-green-500" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-[#59D35D]">
                            {supplier.trustScore}%
                          </div>
                          <div className="text-xs text-gray-500 font-semibold">Trust Score</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {supplier.badges.map((badge, badgeIndex) => (
                          <motion.div
                            key={badge}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: badgeIndex * 0.1 }}
                          >
                            <Badge className="badge badge-success badge-sm text-white">
                              {badge}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mb-3">
                        <div className="text-sm font-bold text-gray-700 mb-1">Specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {supplier.specialties.map((specialty, specialtyIndex) => (
                            <motion.div
                              key={specialty}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: specialtyIndex * 0.1 }}
                            >
                              <Badge variant="outline" className="badge badge-outline badge-sm">
                                {specialty}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="font-semibold">{supplier.distance}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="font-semibold">{supplier.deliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="font-semibold">Min: {supplier.minOrder}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-semibold text-green-600">{supplier.savings} savings</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="btn btn-primary flex-1 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          View Products
                        </Button>
                        <Button variant="outline" className="btn btn-outline rounded-2xl font-bold border-2 hover:bg-gray-100 transition-all duration-300">
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button 
              size="lg" 
              className="btn btn-neutral btn-lg rounded-full px-8 py-4 font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Load More Suppliers
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
