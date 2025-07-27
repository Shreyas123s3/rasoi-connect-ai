
import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Star, Clock, Phone, Truck, Filter, Search, Loader2, Navigation, Users, Package, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import LeafletMap from '@/components/LeafletMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useBulkOrders } from '@/hooks/useBulkOrders';
import { calculateDistance, formatDistance } from '@/utils/distanceUtils';
import { useToast } from '@/hooks/use-toast';

// Extended supplier interface with more details
export interface Supplier {
  id: number;
  name: string;
  lat: number;
  lon: number;
  status: 'open' | 'closed';
  categories: string[];
  distance?: number;
  price: number;
  unit: string;
  minimumOrder: number;
  delivery: boolean;
  pickup: boolean;
  phone: string;
  rating: number;
  totalOrders: number;
  description: string;
}

const Map = () => {
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const { bulkOrders, loading: bulkOrdersLoading, joinBulkOrder } = useBulkOrders();
  const { toast } = useToast();
  
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedBulkOrder, setSelectedBulkOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRadius, setFilterRadius] = useState('5');
  const [filterMaterial, setFilterMaterial] = useState('all');
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [showBulkOrders, setShowBulkOrders] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Enhanced supplier data with more realistic information
  const allSuppliers: Supplier[] = [
    {
      id: 1,
      name: 'Mumbai Fresh Produce',
      lat: 19.076,
      lon: 72.877,
      status: 'open',
      categories: ['Vegetables', 'Onions', 'Tomatoes', 'Potatoes'],
      price: 25,
      unit: 'kg',
      minimumOrder: 10,
      delivery: true,
      pickup: true,
      phone: '+91 98765 43210',
      rating: 4.5,
      totalOrders: 150,
      description: 'Premium quality vegetables sourced directly from farms'
    },
    {
      id: 2,
      name: 'Spice Masters India',
      lat: 19.084,
      lon: 72.874,
      status: 'open',
      categories: ['Spices', 'Turmeric', 'Chili', 'Garam Masala'],
      price: 120,
      unit: 'kg',
      minimumOrder: 5,
      delivery: true,
      pickup: false,
      phone: '+91 98765 43211',
      rating: 4.8,
      totalOrders: 200,
      description: 'Authentic Indian spices with guaranteed quality'
    },
    {
      id: 3,
      name: 'Golden Grain Suppliers',
      lat: 19.089,
      lon: 72.891,
      status: 'closed',
      categories: ['Wheat', 'Rice', 'Pulses', 'Flour'],
      price: 45,
      unit: 'kg',
      minimumOrder: 25,
      delivery: false,
      pickup: true,
      phone: '+91 98765 43212',
      rating: 4.2,
      totalOrders: 85,
      description: 'Bulk grain supplier with competitive prices'
    },
    {
      id: 4,
      name: 'Dairy Fresh Mumbai',
      lat: 19.070,
      lon: 72.880,
      status: 'open',
      categories: ['Dairy', 'Milk', 'Paneer', 'Yogurt'],
      price: 280,
      unit: 'kg',
      minimumOrder: 2,
      delivery: true,
      pickup: true,
      phone: '+91 98765 43213',
      rating: 4.6,
      totalOrders: 320,
      description: 'Fresh dairy products delivered daily'
    },
    {
      id: 5,
      name: 'Organic Fruits Hub',
      lat: 19.082,
      lon: 72.885,
      status: 'open',
      categories: ['Fruits', 'Organic', 'Apples', 'Bananas'],
      price: 80,
      unit: 'kg',
      minimumOrder: 5,
      delivery: true,
      pickup: true,
      phone: '+91 98765 43214',
      rating: 4.4,
      totalOrders: 95,
      description: 'Certified organic fruits and vegetables'
    },
    {
      id: 6,
      name: 'Oil & Ghee Depot',
      lat: 19.078,
      lon: 72.883,
      status: 'open',
      categories: ['Oil', 'Ghee', 'Sunflower Oil', 'Coconut Oil'],
      price: 150,
      unit: 'liter',
      minimumOrder: 5,
      delivery: true,
      pickup: false,
      phone: '+91 98765 43215',
      rating: 4.3,
      totalOrders: 110,
      description: 'Premium cooking oils and ghee at wholesale prices'
    }
  ];

  // Get material categories for filter
  const materialCategories = useMemo(() => {
    const categories = new Set<string>();
    allSuppliers.forEach(supplier => {
      supplier.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories).sort();
  }, []);

  // Filter suppliers based on location, radius, and filters
  const filteredSuppliers = useMemo(() => {
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
      .filter(supplier => {
        const withinRadius = supplier.distance! <= parseInt(filterRadius);
        const matchesSearch = searchTerm === '' || 
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesMaterial = filterMaterial === 'all' || 
          supplier.categories.some(cat => cat.toLowerCase().includes(filterMaterial.toLowerCase()));
        
        return withinRadius && matchesSearch && matchesMaterial;
      })
      .sort((a, b) => a.distance! - b.distance!);
  }, [userLocation, filterRadius, searchTerm, filterMaterial]);

  // Filter bulk orders based on location and radius
  const filteredBulkOrders = useMemo(() => {
    if (!userLocation || !bulkOrders) return [];
    
    // Mock location data for bulk orders (in real app, this would come from the database)
    const bulkOrdersWithLocation = bulkOrders.map(order => ({
      ...order,
      lat: 19.076 + (Math.random() - 0.5) * 0.02, // Random locations near Mumbai
      lon: 72.877 + (Math.random() - 0.5) * 0.02,
    }));
    
    return bulkOrdersWithLocation
      .map(order => ({
        ...order,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lon,
          order.lat,
          order.lon
        )
      }))
      .filter(order => {
        const withinRadius = order.distance! <= parseInt(filterRadius);
        const matchesSearch = searchTerm === '' || 
          order.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        return withinRadius && matchesSearch;
      })
      .sort((a, b) => a.distance! - b.distance!);
  }, [userLocation, bulkOrders, filterRadius, searchTerm]);

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedBulkOrder(null);
  };

  const handleBulkOrderClick = (bulkOrder: any) => {
    setSelectedBulkOrder(bulkOrder);
    setSelectedSupplier(null);
  };

  const handleJoinBulkOrder = async (bulkOrderId: string) => {
    const success = await joinBulkOrder(bulkOrderId);
    if (success) {
      toast({
        title: "Success!",
        description: "You have successfully joined the bulk order.",
      });
    }
  };

  const handleContactSupplier = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const handleWhatsAppContact = (phone: string, supplierName: string) => {
    const message = `Hi, I'm interested in your products. I found you through the Street Food Vendor platform.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
              Find verified suppliers and join bulk orders near you to save costs and get better deals
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
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Search suppliers, materials, or bulk orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 font-semibold border-2 border-gray-200"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="border-2 border-gray-300 font-bold hover:bg-wisteria/20 lg:hidden"
                      >
                        {sidebarOpen ? 'Hide' : 'Show'} List
                      </Button>
                    </div>
                    
                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-bold text-black">Radius:</label>
                        <Select value={filterRadius} onValueChange={setFilterRadius}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 km</SelectItem>
                            <SelectItem value="2">2 km</SelectItem>
                            <SelectItem value="5">5 km</SelectItem>
                            <SelectItem value="10">10 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-bold text-black">Material:</label>
                        <Select value={filterMaterial} onValueChange={setFilterMaterial}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Materials</SelectItem>
                            {materialCategories.map(category => (
                              <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="suppliers" 
                          checked={showSuppliers} 
                          onCheckedChange={setShowSuppliers}
                        />
                        <label htmlFor="suppliers" className="text-sm font-bold text-black">Suppliers</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="bulk-orders" 
                          checked={showBulkOrders} 
                          onCheckedChange={setShowBulkOrders}
                        />
                        <label htmlFor="bulk-orders" className="text-sm font-bold text-black">Bulk Orders</label>
                      </div>
                    </div>
                  </div>

                  {/* Leaflet Map */}
                  {userLocation && (
                    <LeafletMap
                      userLocation={userLocation}
                      suppliers={showSuppliers ? filteredSuppliers : []}
                      bulkOrders={showBulkOrders ? filteredBulkOrders : []}
                      onSupplierClick={handleSupplierClick}
                      onBulkOrderClick={handleBulkOrderClick}
                      selectedSupplier={selectedSupplier}
                      selectedBulkOrder={selectedBulkOrder}
                    />
                  )}

                  {/* Map Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="font-semibold">Your Location</span>
                    </div>
                    {showSuppliers && (
                      <>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-semibold">Open Suppliers</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="font-semibold">Closed Suppliers</span>
                        </div>
                      </>
                    )}
                    {showBulkOrders && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className="font-semibold">Bulk Orders</span>
                      </div>
                    )}
                  </div>

                  {/* Results count */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Showing{' '}
                      {showSuppliers && (
                        <span className="font-bold text-[#59D35D]">{filteredSuppliers.length} suppliers</span>
                      )}
                      {showSuppliers && showBulkOrders && ' and '}
                      {showBulkOrders && (
                        <span className="font-bold text-purple-600">{filteredBulkOrders.length} bulk orders</span>
                      )}
                      {' '}within {filterRadius}km
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden lg:block'} transition-all duration-300`}>
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-black">Nearby Results</h2>
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
                    {/* Suppliers List */}
                    {showSuppliers && filteredSuppliers.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-black mb-3">Suppliers</h3>
                        {filteredSuppliers.map(supplier => (
                          <Card 
                            key={supplier.id} 
                            className={`cursor-pointer transition-all duration-300 border-2 mb-3 ${
                              selectedSupplier?.id === supplier.id 
                                ? 'ring-2 ring-[#59D35D] bg-green-50 border-green-200' 
                                : 'hover:shadow-lg border-white/30 hover:border-wisteria/30'
                            }`}
                            onClick={() => handleSupplierClick(supplier)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-black text-black mb-1">{supplier.name}</h4>
                                  <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-bold">{formatDistance(supplier.distance!)}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs font-bold">{supplier.rating}</span>
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
                                  <div className="flex gap-1">
                                    {supplier.delivery && (
                                      <Badge variant="outline" className="text-xs">
                                        <Truck className="h-3 w-3 mr-1" />
                                        Delivery
                                      </Badge>
                                    )}
                                    {supplier.pickup && (
                                      <Badge variant="outline" className="text-xs">
                                        Pickup
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-2">
                                <div className="flex items-center justify-between">
                                  <span>₹{supplier.price}/{supplier.unit}</span>
                                  <span>Min: {supplier.minimumOrder}{supplier.unit}</span>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-3">
                                {supplier.categories.slice(0, 2).map(category => (
                                  <Badge key={category} variant="outline" className="mr-1 text-xs">
                                    {category}
                                  </Badge>
                                ))}
                                {supplier.categories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{supplier.categories.length - 2} more
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-xs flex-1"
                                  disabled={supplier.status === 'closed'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContactSupplier(supplier.phone);
                                  }}
                                >
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-300 text-xs hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleWhatsAppContact(supplier.phone, supplier.name);
                                  }}
                                >
                                  WhatsApp
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Bulk Orders List */}
                    {showBulkOrders && filteredBulkOrders.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-black mb-3">Bulk Orders</h3>
                        {filteredBulkOrders.map(order => (
                          <Card 
                            key={order.id} 
                            className={`cursor-pointer transition-all duration-300 border-2 mb-3 ${
                              selectedBulkOrder?.id === order.id 
                                ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200' 
                                : 'hover:shadow-lg border-white/30 hover:border-wisteria/30'
                            }`}
                            onClick={() => handleBulkOrderClick(order)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-black text-black mb-1">{order.title}</h4>
                                  <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-bold">{formatDistance(order.distance!)}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <Target className="h-3 w-3 text-purple-500" />
                                    <span className="text-xs font-bold">₹{order.target_price}</span>
                                  </div>
                                </div>
                                <Badge className="text-xs bg-purple-100 text-purple-800">
                                  {order.current_participants}/{order.target_participants}
                                </Badge>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-3">
                                <div className="flex items-center justify-between">
                                  <span>Min: {order.minimum_quantity} units</span>
                                  <span>Current: ₹{order.current_price}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleJoinBulkOrder(order.id);
                                  }}
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  Join Order
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-300 text-xs hover:bg-purple-50"
                                >
                                  <Package className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {filteredSuppliers.length === 0 && filteredBulkOrders.length === 0 && (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No results found within {filterRadius}km</p>
                        <p className="text-sm text-gray-400">Try expanding your search radius or changing filters</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Item Details */}
              {(selectedSupplier || selectedBulkOrder) && (
                <Card className="bg-gradient-to-br from-wisteria to-lemon border-0 mt-6 shadow-xl">
                  <CardContent className="p-6">
                    {selectedSupplier && (
                      <>
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
                            <span className="font-semibold">{selectedSupplier.rating} rating ({selectedSupplier.totalOrders} orders)</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="font-semibold">{selectedSupplier.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            <span className="font-semibold">₹{selectedSupplier.price}/{selectedSupplier.unit} (Min: {selectedSupplier.minimumOrder}{selectedSupplier.unit})</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm font-bold text-black mb-2">Description:</div>
                          <p className="text-sm text-gray-700">{selectedSupplier.description}</p>
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
                            onClick={() => handleContactSupplier(selectedSupplier.phone)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/30 border-white/40 text-black font-bold hover:bg-white/50"
                            onClick={() => handleWhatsAppContact(selectedSupplier.phone, selectedSupplier.name)}
                          >
                            WhatsApp
                          </Button>
                        </div>
                      </>
                    )}

                    {selectedBulkOrder && (
                      <>
                        <h3 className="text-xl font-black text-black mb-4">
                          {selectedBulkOrder.title}
                        </h3>
                        
                        <div className="space-y-3 text-black">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-semibold">
                              {formatDistance(selectedBulkOrder.distance!)} away
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Target: ₹{selectedBulkOrder.target_price}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-semibold">
                              {selectedBulkOrder.current_participants}/{selectedBulkOrder.target_participants} participants
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Min: {selectedBulkOrder.minimum_quantity} units</span>
                          </div>
                        </div>
                        
                        {selectedBulkOrder.description && (
                          <div className="mt-4">
                            <div className="text-sm font-bold text-black mb-2">Description:</div>
                            <p className="text-sm text-gray-700">{selectedBulkOrder.description}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-6">
                          <Button 
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold"
                            onClick={() => handleJoinBulkOrder(selectedBulkOrder.id)}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Join Order
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white/30 border-white/40 text-black font-bold hover:bg-white/50"
                          >
                            View Details
                          </Button>
                        </div>
                      </>
                    )}
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
