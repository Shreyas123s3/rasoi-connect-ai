import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Phone, Truck, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';

const Map = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const suppliers = [
    {
      id: 1,
      name: 'Mumbai Fresh Produce',
      rating: 4.8,
      distance: '2.3 km',
      category: 'Vegetables',
      specialties: ['Onions', 'Tomatoes', 'Potatoes'],
      position: { lat: 19.0760, lng: 72.8777 },
      isOpen: true,
      deliveryAvailable: true,
      phone: '+91 98765 43210',
      address: '123 Market Street, Andheri West'
    },
    {
      id: 2,
      name: 'Spice Masters India',
      rating: 4.9,
      distance: '1.8 km',
      category: 'Spices',
      specialties: ['Turmeric', 'Chili', 'Garam Masala'],
      position: { lat: 19.0896, lng: 72.8656 },
      isOpen: true,
      deliveryAvailable: false,
      phone: '+91 98765 43211',
      address: '456 Spice Market, Bandra East'
    },
    {
      id: 3,
      name: 'Golden Grain Suppliers',
      rating: 4.7,
      distance: '3.1 km',
      category: 'Grains',
      specialties: ['Wheat', 'Rice', 'Pulses'],
      position: { lat: 19.0596, lng: 72.8295 },
      isOpen: false,
      deliveryAvailable: true,
      phone: '+91 98765 43212',
      address: '789 Grain Bazaar, Worli'
    }
  ];

  const mapStyle: React.CSSProperties = {
    width: '100%',
    height: '500px',
    background: 'linear-gradient(135deg, #4C9DB0 0%, #59D35D 100%)',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR]">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-black mb-4">
              SUPPLIER <span className="text-[#59D35D]">MAP</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Find verified suppliers near you with real-time availability and delivery options
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-2 border-gray-200 mb-6">
                <CardContent className="p-6">
                  {/* Search & Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search location or supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-semibold"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="border-2 border-gray-300 font-bold"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  {/* Mock Map */}
                  <div style={mapStyle} className="border-2 border-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <MapPin className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-black mb-2">Interactive Map</h3>
                        <p className="text-lg opacity-90">Suppliers marked with pins</p>
                        <p className="text-sm opacity-75 mt-2">Click on markers to view supplier details</p>
                      </div>
                    </div>
                    
                    {/* Mock map pins */}
                    {suppliers.map((supplier, index) => (
                      <div
                        key={supplier.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                        style={{
                          left: `${25 + (index * 20)}%`,
                          top: `${30 + (index * 15)}%`
                        }}
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-300">
                          <MapPin className="h-6 w-6 text-[#59D35D]" />
                        </div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">
                          {supplier.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Open Now</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Closed</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="font-semibold">Delivery Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suppliers List */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-black text-black mb-6">Nearby Suppliers</h2>
                  
                  <div className="space-y-4">
                    {suppliers.map(supplier => (
                      <Card 
                        key={supplier.id} 
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedSupplier?.id === supplier.id 
                            ? 'ring-2 ring-[#59D35D] bg-green-50' 
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-black text-black mb-1">{supplier.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs font-bold ml-1">{supplier.rating}</span>
                                </div>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs font-semibold text-gray-600">{supplier.distance}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {supplier.isOpen ? (
                                <Badge className="bg-green-100 text-green-800 text-xs">Open</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 text-xs">Closed</Badge>
                              )}
                              {supplier.deliveryAvailable && (
                                <Badge variant="outline" className="text-xs">
                                  <Truck className="h-3 w-3 mr-1" />
                                  Delivery
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-600 mb-3">
                            <Badge variant="outline" className="mr-2">{supplier.category}</Badge>
                            {supplier.specialties.slice(0, 2).map(specialty => (
                              <Badge key={specialty} variant="outline" className="mr-1 text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-xs flex-1">
                              View Products
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-xs">
                              <Phone className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Supplier Details */}
              {selectedSupplier && (
                <Card className="bg-gradient-to-br from-[#59D35D] to-[#4BC44F] border-0 mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-black mb-4">
                      {selectedSupplier.name}
                    </h3>
                    
                    <div className="space-y-3 text-black">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{selectedSupplier.rating} rating</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{selectedSupplier.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-semibold">
                          {selectedSupplier.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{selectedSupplier.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-bold text-black mb-2">Specialties:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSupplier.specialties.map(specialty => (
                          <Badge key={specialty} className="bg-white/20 text-black text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-bold">
                        Call Now
                      </Button>
                      <Button variant="outline" className="bg-white/20 border-white/30 text-black font-bold">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
