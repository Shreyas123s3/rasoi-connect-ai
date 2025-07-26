import React, { useState } from 'react';
import { Star, Phone, MapPin, Award, Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import SupplierModal from '@/components/SupplierModal';
import AuthGuard from '@/components/AuthGuard';
import { useSuppliers } from '@/hooks/useSuppliers';

const Suppliers = () => {
  const { suppliers, loading, error } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter === 'All' || supplier.location === locationFilter;
    const matchesSpecialty = specialtyFilter === 'All' || supplier.specialties.includes(specialtyFilter);
    
    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  const locations = ['All', ...Array.from(new Set(suppliers.map(s => s.location)))];
  const specialties = ['All', ...Array.from(new Set(suppliers.flatMap(s => s.specialties)))];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-black mb-4">
                VERIFIED <span className="text-[#59D35D]">SUPPLIERS</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Connect with trusted suppliers for fresh produce and competitive prices
              </p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="text-2xl font-bold">Loading suppliers...</div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600">
                <div className="text-xl font-bold">Error: {error}</div>
              </div>
            ) : (
              <>
                {/* Search and Filters */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-white/20 shadow-xl">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input
                        placeholder="Search suppliers..."
                        className="pl-10 font-semibold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="font-semibold">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger className="font-semibold">
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSuppliers.map(supplier => (
                    <Card key={supplier.id} className="bg-white/95 border-2 border-white/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-black text-black mb-2 flex items-center gap-2">
                              {supplier.business_name}
                              {supplier.verified && (
                                <Award className="h-5 w-5 text-green-500" />
                              )}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="font-semibold">{supplier.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-lg font-black">{supplier.rating}</span>
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">{supplier.total_orders} orders</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {supplier.specialties.slice(0, 3).map(specialty => (
                            <Badge key={specialty} variant="secondary" className="bg-lemon/30 text-gray-800 font-semibold">
                              {specialty}
                            </Badge>
                          ))}
                          {supplier.specialties.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-200 text-gray-600 font-semibold">
                              +{supplier.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="font-semibold">{supplier.phone}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                            onClick={() => setSelectedSupplier(supplier)}
                          >
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="border-2 font-bold">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredSuppliers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-600 mb-2">No suppliers found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedSupplier && (
          <SupplierModal
            supplier={selectedSupplier}
            onClose={() => setSelectedSupplier(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
};

export default Suppliers;
