
import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Star, Clock, Phone, Truck, Filter, Search, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import LeafletMap, { Supplier } from '@/components/LeafletMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/utils/distanceUtils';

const Map = () => {
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Hardcoded supplier data
  const allSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'Mumbai Fresh Produce',
      lat: 19.076,
      lon: 72.877,
      status: 'open',
      categories: ['Vegetables', 'Onions', 'Tomatoes', 'Potatoes']
    },
    {
      id: 2,
      name: 'Spice Masters India',
      lat: 19.084,
      lon: 72.874,
      status: 'open',
      categories: ['Spices', 'Turmeric', 'Chili', 'Garam Masala']
    },
    {
      id: 3,
      name: 'Golden Grain Suppliers',
      lat: 19.089,
      lon: 72.891,
      status: 'closed',
      categories: ['Wheat', 'Grains', 'Rice', 'Pulses']
    },
    {
      id: 4,
      name: 'Dairy Fresh Mumbai',
      lat: 19.070,
      lon: 72.880,
      status: 'open',
      categories: ['Dairy', 'Milk', 'Paneer', 'Yogurt']
    },
    {
      id: 5,
      name: 'Organic Fruits Hub',
      lat: 19.082,
      lon: 72.885,
      status: 'open',
      categories: ['Fruits', 'Organic', 'Apples', 'Bananas']
    }
  ];

  // Filter suppliers within 5km and calculate distances
  const nearbySuppliers = useMemo(() => {
    if (!userLocation) return [];
    
    return allSuppliers
      .map(supplier => ({
        ...supplier,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lon,
          supplier.lat,
          supplier.lon
        )
      }))
      .filter(supplier => supplier.distance! <= 5)
      .sort((a, b) => a.distance! - b.distance!);
  }, [userLocation]);

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return nearbySuppliers;
    
    return nearbySuppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [nearbySuppliers, searchTerm]);

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#59D35D] mx-auto mb-4" />
                <h2 className="text-2xl font-black text-black mb-2">Getting Your Location</h2>
                <p className="text-gray-600">Please allow location access to find nearby suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-black mb-4">
              SUPPLIER <span className="text-[#59D35D]">LOCATOR</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Find verified suppliers near you with real-time location and distance tracking
            </p>
            {locationError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">
                  <Navigation className="h-4 w-4 inline mr-1" />
                  {locationError} - Using default location (Mumbai)
                </p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className={`${sidebarOpen ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-300`}>
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl mb-6">
                <CardContent className="p-6">
                  {/* Search & Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search suppliers or products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 font-semibold border-2 border-gray-200"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="border-2 border-gray-300 font-bold hover:bg-wisteria/20"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="border-2 border-gray-300 font-bold hover:bg-wisteria/20 lg:hidden"
                    >
                      {sidebarOpen ? 'Hide' : 'Show'} List
                    </Button>
                  </div>

                  {/* Leaflet Map */}
                  {userLocation && (
                    <LeafletMap
                      userLocation={userLocation}
                      suppliers={filteredSuppliers}
                      onSupplierClick={handleSupplierClick}
                      selectedSupplier={selectedSupplier}
                    />
                  )}

                  {/* Map Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Your Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Open Suppliers</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Closed Suppliers</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-semibold">Within 5km radius</span>
                    </div>
                  </div>

                  {/* Supplier count */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-bold text-[#59D35D]">{filteredSuppliers.length}</span> suppliers within 5km
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suppliers Sidebar */}
            <div className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'} transition-all duration-300`}>
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-black">Nearby Suppliers</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden"
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredSuppliers.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No suppliers found within 5km</p>
                        <p className="text-sm text-gray-400">Try expanding your search area</p>
                      </div>
                    ) : (
                      filteredSuppliers.map(supplier => (
                        <Card 
                          key={supplier.id} 
                          className={`cursor-pointer transition-all duration-300 border-2 ${
                            selectedSupplier?.id === supplier.id 
                              ? 'ring-2 ring-[#59D35D] bg-green-50 border-green-200' 
                              : 'hover:shadow-lg border-white/30 hover:border-wisteria/30'
                          }`}
                          onClick={() => handleSupplierClick(supplier)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-black text-black mb-1">{supplier.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-bold ml-1">
                                      {formatDistance(supplier.distance!)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">•</span>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs font-bold ml-1">4.{supplier.id + 5}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge className={`text-xs ${
                                  supplier.status === 'open' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {supplier.status === 'open' ? 'Open' : 'Closed'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Truck className="h-3 w-3 mr-1" />
                                  Delivery
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-3">
                              {supplier.categories.slice(0, 3).map(category => (
                                <Badge key={category} variant="outline" className="mr-1 text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-xs flex-1"
                                disabled={supplier.status === 'closed'}
                              >
                                View Products
                              </Button>
                              <Button size="sm" variant="outline" className="border-gray-300 text-xs hover:bg-wisteria/20">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Supplier Details */}
              {selectedSupplier && (
                <Card className="bg-gradient-to-br from-wisteria to-lemon border-0 mt-6 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-black mb-4">
                      {selectedSupplier.name}
                    </h3>
                    
                    <div className="space-y-3 text-black">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-semibold">
                          {formatDistance(selectedSupplier.distance!)} away
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-semibold">
                          {selectedSupplier.status === 'open' ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        <span className="font-semibold">4.{selectedSupplier.id + 5} rating</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="font-semibold">+91 98765 4321{selectedSupplier.id}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm font-bold text-black mb-2">Categories:</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSupplier.categories.map(category => (
                          <Badge key={category} className="bg-white/30 text-black text-xs border-white/20">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button 
                        className="flex-1 bg-black hover:bg-gray-800 text-white font-bold"
                        disabled={selectedSupplier.status === 'closed'}
                      >
                        Call Now
                      </Button>
                      <Button variant="outline" className="bg-white/30 border-white/40 text-black font-bold hover:bg-white/50">
                        Directions
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
