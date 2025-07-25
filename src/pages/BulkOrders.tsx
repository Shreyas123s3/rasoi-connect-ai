
import React, { useState, useEffect } from 'react';
import { Users, Clock, TrendingDown, MapPin, ShoppingCart, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';

const BulkOrders = () => {
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 1,
      product: 'Premium Onions',
      currentPrice: 42,
      targetPrice: 36,
      currentParticipants: 8,
      targetParticipants: 12,
      timeLeft: '4h 23m',
      location: 'Andheri West',
      supplier: 'Mumbai Fresh Produce',
      minQuantity: '25kg per vendor',
      savings: 14,
      category: 'Vegetables',
      urgency: 'high'
    },
    {
      id: 2,
      product: 'Cooking Oil (15L)',
      currentPrice: 180,
      targetPrice: 165,
      currentParticipants: 5,
      targetParticipants: 8,
      timeLeft: '2h 45m',
      location: 'Bandra',
      supplier: 'Golden Oil Trading',
      minQuantity: '15L per vendor',
      savings: 8,
      category: 'Oil',
      urgency: 'medium'
    },
    {
      id: 3,
      product: 'Basmati Rice (50kg)',
      currentPrice: 280,
      targetPrice: 250,
      currentParticipants: 3,
      targetParticipants: 10,
      timeLeft: '6h 12m',
      location: 'Thane',
      supplier: 'Rice Masters',
      minQuantity: '50kg per vendor',
      savings: 11,
      category: 'Grains',
      urgency: 'low'
    }
  ]);

  const categories = ['All', 'Vegetables', 'Oil', 'Grains', 'Spices', 'Dairy'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredOrders = activeOrders.filter(order => 
    selectedCategory === 'All' || order.category === selectedCategory
  );

  const joinOrder = (orderId: number) => {
    setActiveOrders(orders => 
      orders.map(order => 
        order.id === orderId 
          ? { ...order, currentParticipants: order.currentParticipants + 1 }
          : order
      )
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEBF] to-[#FDFDCR]">
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
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-[#59D35D] mx-auto mb-2" />
                <div className="text-2xl font-black text-black">156</div>
                <div className="text-sm font-semibold text-gray-600">Active Participants</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-green-600">25%</div>
                <div className="text-sm font-semibold text-gray-600">Average Savings</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-black">23</div>
                <div className="text-sm font-semibold text-gray-600">Live Orders</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <Timer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-black">2.3h</div>
                <div className="text-sm font-semibold text-gray-600">Avg. Close Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold" 
                    : "border-2 border-gray-300 font-bold hover:bg-gray-100"
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
            
            {filteredOrders.map(order => (
              <Card key={order.id} className="bg-white border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-black text-black mb-2">
                        {order.product}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{order.location}</span>
                        </div>
                        <div className="font-semibold">by {order.supplier}</div>
                        <Badge className={getUrgencyColor(order.urgency)}>
                          {order.urgency} priority
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="text-lg font-black text-red-600">{order.timeLeft}</span>
                      </div>
                      <div className="text-sm text-gray-500 font-semibold">Time left</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Price Display */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-red-600 mb-1">₹{order.currentPrice}</div>
                      <div className="text-sm font-semibold text-gray-500">Current Price/kg</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#59D35D] mb-1">₹{order.targetPrice}</div>
                      <div className="text-sm font-semibold text-gray-500">Target Price/kg</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-600 mb-1">{order.savings}%</div>
                      <div className="text-sm font-semibold text-gray-500">Potential Savings</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-700">
                        {order.currentParticipants} / {order.targetParticipants} vendors joined
                      </span>
                      <span className="font-bold text-[#59D35D]">
                        {Math.round((order.currentParticipants / order.targetParticipants) * 100)}% complete
                      </span>
                    </div>
                    <Progress 
                      value={(order.currentParticipants / order.targetParticipants) * 100} 
                      className="h-3 bg-gray-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Need {order.targetParticipants - order.currentParticipants} more</span>
                      <span>Min: {order.minQuantity}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-4">
                    <Button 
                      size="lg"
                      className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-lg py-3"
                      onClick={() => joinOrder(order.id)}
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Join This Order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-gray-300 font-bold px-6"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Order CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-[#59D35D] to-[#4BC44F] border-0">
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
