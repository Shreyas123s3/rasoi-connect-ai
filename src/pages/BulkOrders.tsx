
import React, { useState } from 'react';
import { Users, Clock, TrendingDown, MapPin, ShoppingCart, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useBulkOrders } from '@/hooks/useBulkOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BulkOrders = () => {
  const { bulkOrders, loading, joinBulkOrder } = useBulkOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [joiningOrders, setJoiningOrders] = useState<Set<string>>(new Set());

  const categories = ['All', 'Vegetables', 'Oil', 'Grains', 'Spices', 'Dairy'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredOrders = bulkOrders.filter(order => 
    selectedCategory === 'All' || order.title.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const handleJoinOrder = async (orderId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setJoiningOrders(prev => new Set(prev).add(orderId));
    
    const success = await joinBulkOrder(orderId, 1);
    
    if (success) {
      toast({
        title: "Joined Successfully!",
        description: "You have joined this bulk order.",
      });
    } else {
      toast({
        title: "Failed to Join",
        description: "Could not join the bulk order. Please try again.",
        variant: "destructive",
      });
    }
    
    setJoiningOrders(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getUrgencyColor = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hoursLeft = (expires.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft <= 2) return 'text-red-600 bg-red-100';
    if (hoursLeft <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className="text-2xl font-bold">Loading bulk orders...</div>
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
              <span className="text-[#59D35D]">BULK</span> ORDERS
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Join other vendors to unlock better prices. More participants = bigger savings!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-[#59D35D] mx-auto mb-2" />
                <div className="text-2xl font-black text-black">
                  {bulkOrders.reduce((sum, order) => sum + order.current_participants, 0)}
                </div>
                <div className="text-sm font-semibold text-gray-600">Active Participants</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-green-600">25%</div>
                <div className="text-sm font-semibold text-gray-600">Average Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-black">{bulkOrders.length}</div>
                <div className="text-sm font-semibold text-gray-600">Live Orders</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/20 shadow-xl">
              <CardContent className="p-6 text-center">
                <Timer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-black">2.3h</div>
                <div className="text-sm font-semibold text-gray-600">Avg. Close Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-white/20 shadow-xl">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold" 
                    : "border-2 border-gray-300 font-bold hover:bg-wisteria/20"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Orders */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-black mb-6">Live Bulk Orders</h2>
            
            {filteredOrders.length === 0 ? (
              <Card className="bg-white/95 border-2 border-white/30 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-gray-600 mb-2">No Active Orders</h3>
                  <p className="text-gray-500">Be the first to start a bulk order in this category!</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map(order => (
                <Card key={order.id} className="bg-white/95 border-2 border-white/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-black text-black mb-2">
                          {order.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="font-semibold">{order.location}</span>
                          </div>
                          <Badge className={getUrgencyColor(order.expires_at)}>
                            high priority
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span className="text-lg font-black text-red-600">
                            {getTimeLeft(order.expires_at)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">Time left</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Price Display */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-black text-red-600 mb-1">₹{order.current_price}</div>
                        <div className="text-sm font-semibold text-gray-500">Current Price/kg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-[#59D35D] mb-1">₹{order.target_price}</div>
                        <div className="text-sm font-semibold text-gray-500">Target Price/kg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-green-600 mb-1">
                          {Math.round(((order.current_price - order.target_price) / order.current_price) * 100)}%
                        </div>
                        <div className="text-sm font-semibold text-gray-500">Potential Savings</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">
                          {order.current_participants} / {order.target_participants} vendors joined
                        </span>
                        <span className="font-bold text-[#59D35D]">
                          {Math.round((order.current_participants / order.target_participants) * 100)}% complete
                        </span>
                      </div>
                      <Progress 
                        value={(order.current_participants / order.target_participants) * 100} 
                        className="h-3 bg-gray-200"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Need {order.target_participants - order.current_participants} more</span>
                        <span>Min: {order.minimum_quantity}kg</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-4">
                      <Button 
                        size="lg"
                        className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-lg py-3"
                        onClick={() => handleJoinOrder(order.id)}
                        disabled={joiningOrders.has(order.id)}
                      >
                        <Users className="h-5 w-5 mr-2" />
                        {joiningOrders.has(order.id) ? 'Joining...' : 'Join This Order'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-gray-300 font-bold px-6 hover:bg-wisteria/20"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create Order CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-wisteria to-lemon border-0 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-3xl font-black text-black mb-4">
                  Can't Find What You Need?
                </h3>
                <p className="text-lg text-gray-800 mb-6">
                  Start your own bulk order and invite nearby vendors to join
                </p>
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4">
                  Start New Bulk Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrders;
