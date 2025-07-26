
import React from 'react';
import { MapPin, Navigation, Truck, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

const Map = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-black mb-4">
                LOCATION <span className="text-[#59D35D]">MAP</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Find suppliers, markets, and delivery routes near you
              </p>
            </div>

            {/* Map Placeholder */}
            <Card className="bg-white/95 border-2 border-white/30 backdrop-blur-sm mb-8">
              <CardContent className="p-0">
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-600 mb-2">Interactive Map</h3>
                    <p className="text-gray-500">Map integration coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Store className="h-12 w-12 text-[#59D35D] mx-auto mb-4" />
                  <h3 className="text-lg font-black text-black mb-2">Find Markets</h3>
                  <p className="text-sm text-gray-600 mb-4">Locate nearby wholesale markets</p>
                  <Button className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                    Search
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Truck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-black mb-2">Delivery Routes</h3>
                  <p className="text-sm text-gray-600 mb-4">Plan optimal delivery routes</p>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
                    Plan Route
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Navigation className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-black mb-2">Live Tracking</h3>
                  <p className="text-sm text-gray-600 mb-4">Track deliveries in real-time</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    Track
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-black mb-2">Nearby Suppliers</h3>
                  <p className="text-sm text-gray-600 mb-4">Find suppliers in your area</p>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold">
                    Find
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Locations */}
            <Card className="bg-white/95 border-2 border-white/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-black">Recent Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Delhi Wholesale Market', address: 'Azadpur Mandi, Delhi', type: 'Market', distance: '2.5 km' },
                    { name: 'Fresh Produce Supplier', address: 'Ghaziabad, UP', type: 'Supplier', distance: '12 km' },
                    { name: 'Organic Farms Co.', address: 'Faridabad, Haryana', type: 'Supplier', distance: '18 km' }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-[#59D35D]" />
                        <div>
                          <h4 className="font-bold text-black">{location.name}</h4>
                          <p className="text-sm text-gray-600">{location.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">{location.type}</Badge>
                        <p className="text-sm text-gray-600 font-semibold">{location.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Map;
