
import React, { useState } from 'react';
import { Bell, Plus, Trash2, Edit, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import LivePriceTracker from '@/components/LivePriceTracker';
import { useSupabaseAlerts } from '@/hooks/useSupabaseAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const { alerts, loading, addAlert, deleteAlert } = useSupabaseAlerts();
  const { user } = useAuth();
  const { toast } = useToast();

  const [newAlert, setNewAlert] = useState({
    product: '',
    condition: 'below',
    threshold: '',
    unit: 'kg'
  });

  const handleAddAlert = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create alerts.",
        variant: "destructive",
      });
      return;
    }

    if (newAlert.product && newAlert.threshold) {
      const thresholdPrice = parseFloat(newAlert.threshold);
      const currentPrice = Math.floor(Math.random() * 100) + 20; // Mock current price
      
      const result = await addAlert(newAlert.product, currentPrice, thresholdPrice);
      
      if (result) {
        setNewAlert({ product: '', condition: 'below', threshold: '', unit: 'kg' });
        toast({
          title: "Alert Created!",
          description: `Alert for ${newAlert.product} has been created successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create alert. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    await deleteAlert(alertId);
    toast({
      title: "Alert Deleted",
      description: "The alert has been removed successfully.",
    });
  };

  const getAlertStatus = (alert: any) => {
    if (alert.status === 'triggered') return { color: 'bg-red-100 text-red-800', text: 'Triggered' };
    if (alert.status === 'active') return { color: 'bg-green-100 text-green-800', text: 'Active' };
    return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
              <CardContent className="p-8">
                <AlertTriangle className="h-16 w-16 text-wisteria mx-auto mb-4" />
                <h2 className="text-2xl font-black text-black mb-4">Authentication Required</h2>
                <p className="text-gray-600 mb-6">
                  Please sign in to view and manage your price alerts.
                </p>
                <Button 
                  className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-black mb-4">
              SMART <span className="text-[#59D35D]">ALERTS</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Never miss a good deal or price drop. Set custom alerts and stay ahead of market changes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Alerts Management */}
            <div className="lg:col-span-2">
              {/* Add Alert */}
              <Card className="bg-gradient-to-r from-wisteria/20 to-lemon/30 backdrop-blur-sm border-2 border-wisteria/30 mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black text-black">Create New Alert</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-2 border-wisteria/30">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-black">Create Price Alert</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-bold">Product</Label>
                            <Input
                              value={newAlert.product}
                              onChange={(e) => setNewAlert({...newAlert, product: e.target.value})}
                              placeholder="e.g., Onions, Rice, Cooking Oil"
                              className="font-semibold border-wisteria/30"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-bold">Alert Condition</Label>
                            <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
                              <SelectTrigger className="font-semibold border-wisteria/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="below">Price falls below</SelectItem>
                                <SelectItem value="above">Price rises above</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-bold">Threshold Price (₹)</Label>
                              <Input
                                type="number"
                                value={newAlert.threshold}
                                onChange={(e) => setNewAlert({...newAlert, threshold: e.target.value})}
                                placeholder="0"
                                className="font-semibold border-wisteria/30"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-bold">Unit</Label>
                              <Select value={newAlert.unit} onValueChange={(value) => setNewAlert({...newAlert, unit: value})}>
                                <SelectTrigger className="font-semibold border-wisteria/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">per kg</SelectItem>
                                  <SelectItem value="15L">per 15L</SelectItem>
                                  <SelectItem value="50kg">per 50kg bag</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={handleAddAlert} className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                            Create Alert
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
              </Card>

              {/* Active Alerts */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-wisteria/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-black">Your Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Loading alerts...</p>
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No alerts created yet</p>
                      <p className="text-sm text-gray-500">Create your first alert to get notified about price changes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.map(alert => {
                        const status = getAlertStatus(alert);
                        return (
                          <div key={alert.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-lemon/20 to-wisteria/10 rounded-lg border-2 border-wisteria/20">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-black text-lg text-black">{alert.product_name}</h3>
                                <Badge className={status.color}>{status.text}</Badge>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="font-semibold">
                                  Alert when price falls below ₹{alert.price_threshold}
                                </div>
                                <div>
                                  Current price: <span className="font-bold">₹{alert.current_price}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Created: {new Date(alert.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {alert.status === 'triggered' && (
                                <Button size="sm" className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                                  View Deals
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="border-2 border-wisteria/40 hover:bg-wisteria/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Price Tracker and Settings */}
            <div className="lg:col-span-1">
              {/* Live Price Tracker */}
              <LivePriceTracker alerts={alerts} />

              {/* Alert Settings */}
              <Card className="bg-gradient-to-br from-wisteria/30 to-white backdrop-blur-sm border-2 border-wisteria/30 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Email Notifications</span>
                    <Button size="sm" variant="outline" className="border-2 border-green-300 text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">SMS Alerts</span>
                    <Button size="sm" variant="outline" className="border-2 border-wisteria/40 hover:bg-wisteria/10">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Push Notifications</span>
                    <Button size="sm" variant="outline" className="border-2 border-green-300 text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Enabled
                    </Button>
                  </div>
                  
                  <Button className="w-full bg-wisteria hover:bg-wisteria/90 text-white font-bold mt-4">
                    Update Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
