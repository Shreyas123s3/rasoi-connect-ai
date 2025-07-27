
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, MapPin, Calendar, TrendingUp, Package } from 'lucide-react';
import { useBulkOrders } from '@/hooks/useBulkOrders';
import { useAuth } from '@/contexts/AuthContext';
import BulkOrderForm from '@/components/BulkOrderForm';

const BulkOrders = () => {
  const { user } = useAuth();
  const { bulkOrders, loading, refetch } = useBulkOrders();
  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wisteria mx-auto mb-4"></div>
            <p className="text-black font-semibold">Loading bulk orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">Bulk Orders</h1>
            <p className="text-black/70 font-semibold">Join group orders to get better prices</p>
          </div>
          {user && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Start New Bulk Order
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-[#59D35D]" />
                <div className="ml-4">
                  <p className="text-sm font-semibold text-black/70">Active Orders</p>
                  <p className="text-2xl font-black text-black">
                    {bulkOrders?.filter(order => order.status === 'active').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-wisteria" />
                <div className="ml-4">
                  <p className="text-sm font-semibold text-black/70">Total Participants</p>
                  <p className="text-2xl font-black text-black">
                    {bulkOrders?.reduce((sum, order) => sum + (order.current_participants || 1), 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-[#FFA500]" />
                <div className="ml-4">
                  <p className="text-sm font-semibold text-black/70">Avg. Savings</p>
                  <p className="text-2xl font-black text-black">15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-black text-black mb-6">Live Bulk Orders</h2>
          {bulkOrders && bulkOrders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bulkOrders.map((order) => (
                <Card key={order.id} className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-black text-black line-clamp-2">
                        {order.title}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-black/70 line-clamp-2">{order.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-wisteria mr-2" />
                      <span className="font-semibold text-black">{order.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-wisteria mr-2" />
                      <span className="font-semibold text-black">
                        Expires: {formatDate(order.expires_at)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-black/70">Target Price</p>
                        <p className="font-black text-[#59D35D]">₹{order.target_price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/70">Current Price</p>
                        <p className="font-black text-red-600">₹{order.current_price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-black/70">Participants</p>
                        <p className="font-black text-black">
                          {order.current_participants || 1}/{order.target_participants}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-black/70">Min. Quantity</p>
                        <p className="font-black text-black">{order.minimum_quantity}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-[#59D35D] h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, ((order.current_participants || 1) / order.target_participants) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-center text-black/70">
                        {Math.round(((order.current_participants || 1) / order.target_participants) * 100)}% of target reached
                      </p>
                    </div>

                    {user && order.status === 'active' && (
                      <Button 
                        className="w-full bg-wisteria hover:bg-wisteria/90 text-white font-bold"
                        size="sm"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Join Order
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
              <CardContent className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-wisteria/50 mb-4" />
                <h3 className="text-xl font-black text-black mb-2">No Bulk Orders Available</h3>
                <p className="text-black/70 mb-6">Be the first to start a bulk order and save money together!</p>
                {user && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Bulk Order
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {showForm && (
          <BulkOrderForm
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default BulkOrders;
