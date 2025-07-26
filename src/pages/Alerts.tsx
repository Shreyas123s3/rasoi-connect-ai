
import React from 'react';
import { Bell, Plus, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { useAlerts } from '@/hooks/useAlerts';

const Alerts = () => {
  const { alerts, loading, error } = useAlerts();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-lemon to-wisteria">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-black mb-4">
                PRICE <span className="text-[#59D35D]">ALERTS</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Never miss a price change with personalized alerts
              </p>
            </div>

            {loading ? (
              <div className="text-center">
                <div className="text-2xl font-bold">Loading alerts...</div>
              </div>
            ) : (
              <>
                {/* Create Alert Button */}
                <div className="text-center mb-8">
                  <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold text-lg px-8 py-4">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Alert
                  </Button>
                </div>

                {/* Alerts List */}
                <div className="space-y-6">
                  {alerts.length === 0 ? (
                    <Card className="bg-white/95 border-2 border-white/30 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-gray-600 mb-2">No alerts set</h3>
                        <p className="text-gray-500 mb-4">Create your first price alert to get notified</p>
                        <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                          <Plus className="h-5 w-5 mr-2" />
                          Create Alert
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    alerts.map(alert => (
                      <Card key={alert.id} className="bg-white/95 border-2 border-white/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-black text-black mb-2">
                                {alert.product_name}
                              </CardTitle>
                              <Badge 
                                className={alert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                              >
                                {alert.status}
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm" className="font-bold">
                              Edit
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-black text-red-600">₹{alert.current_price}</div>
                              <div className="text-sm font-semibold text-gray-500">Current Price</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-black text-[#59D35D]">₹{alert.price_threshold}</div>
                              <div className="text-sm font-semibold text-gray-500">Alert Price</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                {alert.current_price <= alert.price_threshold ? (
                                  <TrendingDown className="h-6 w-6 text-green-500" />
                                ) : (
                                  <TrendingUp className="h-6 w-6 text-red-500" />
                                )}
                              </div>
                              <div className="text-sm font-semibold text-gray-500">Trend</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Created {new Date(alert.created_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Alerts;
