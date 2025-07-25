
import React, { useState } from 'react';
import { Bell, Plus, Trash2, Edit, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      product: 'Onions',
      condition: 'below',
      threshold: 35,
      currentPrice: 42,
      unit: 'kg',
      status: 'active',
      triggered: false,
      createdAt: '2024-01-20'
    },
    {
      id: 2,
      product: 'Tomatoes',
      condition: 'above',
      threshold: 40,
      currentPrice: 35,
      unit: 'kg',
      status: 'active',
      triggered: false,
      createdAt: '2024-01-18'
    },
    {
      id: 3,
      product: 'Cooking Oil',
      condition: 'below',
      threshold: 170,
      currentPrice: 180,
      unit: '15L',
      status: 'triggered',
      triggered: true,
      createdAt: '2024-01-15'
    }
  ]);

  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: 1,
      message: 'Onion prices dropped to ₹32/kg - 8% below your threshold',
      time: '2 hours ago',
      type: 'price_drop',
      read: false
    },
    {
      id: 2,
      message: 'New bulk order for Rice started - join to save 15%',
      time: '5 hours ago',
      type: 'bulk_order',
      read: false
    },
    {
      id: 3,
      message: 'Cooking Oil stock running low at your preferred supplier',
      time: '1 day ago',
      type: 'stock_alert',
      read: true
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    product: '',
    condition: 'below',
    threshold: '',
    unit: 'kg'
  });

  const addAlert = () => {
    if (newAlert.product && newAlert.threshold) {
      const alert = {
        id: Date.now(),
        product: newAlert.product,
        condition: newAlert.condition,
        threshold: parseFloat(newAlert.threshold),
        currentPrice: Math.floor(Math.random() * 100) + 20, // Mock current price
        unit: newAlert.unit,
        status: 'active',
        triggered: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setAlerts([...alerts, alert]);
      setNewAlert({ product: '', condition: 'below', threshold: '', unit: 'kg' });
    }
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertStatus = (alert: any) => {
    if (alert.triggered) return { color: 'bg-red-100 text-red-800', text: 'Triggered' };
    if (alert.status === 'active') return { color: 'bg-green-100 text-green-800', text: 'Active' };
    return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'bulk_order': return <Bell className="h-4 w-4 text-blue-500" />;
      case 'stock_alert': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
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
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 mb-8">
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
                      <DialogContent>
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
                              className="font-semibold"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-bold">Alert Condition</Label>
                            <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
                              <SelectTrigger className="font-semibold">
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
                                className="font-semibold"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-bold">Unit</Label>
                              <Select value={newAlert.unit} onValueChange={(value) => setNewAlert({...newAlert, unit: value})}>
                                <SelectTrigger className="font-semibold">
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
                          <Button onClick={addAlert} className="w-full bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                            Create Alert
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
              </Card>

              {/* Active Alerts */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-black">Your Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map(alert => {
                      const status = getAlertStatus(alert);
                      return (
                        <div key={alert.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-black text-lg text-black">{alert.product}</h3>
                              <Badge className={status.color}>{status.text}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="font-semibold">
                                Alert when price {alert.condition} ₹{alert.threshold}/{alert.unit}
                              </div>
                              <div>
                                Current price: <span className="font-bold">₹{alert.currentPrice}/{alert.unit}</span>
                              </div>
                              <div className="text-xs text-gray-500">Created: {alert.createdAt}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {alert.triggered && (
                              <Button size="sm" className="bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold">
                                View Deals
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="border-2 border-gray-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => deleteAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-black flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentNotifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-lg border-2 ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-black'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 border-2 border-gray-300 font-bold">
                    View All Notifications
                  </Button>
                </CardContent>
              </Card>

              {/* Alert Settings */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 mt-6">
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
                    <Button size="sm" variant="outline" className="border-2 border-gray-300">
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
                  
                  <Button className="w-full bg-black hover:bg-gray-800 text-white font-bold mt-4">
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
