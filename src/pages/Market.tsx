import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import SupplierModal from '@/components/SupplierModal';
import ConfettiAlert from '@/components/ConfettiAlert';
import { useSupabaseAlerts } from '@/hooks/useSupabaseAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Market = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiProduct, setConfettiProduct] = useState('');
  
  const { user } = useAuth();
  const { addAlert } = useSupabaseAlerts();
  const { toast } = useToast();

  const categories = ['All', 'Vegetables', 'Spices', 'Grains', 'Oils', 'Dairy', 'Fruits', 'Pulses'];
  const periods = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' }
  ];

  const marketData = [
    {
      name: 'Onions',
      category: 'Vegetables',
      currentPrice: 42,
      previousPrice: 48,
      change: -12.5,
      unit: 'kg',
      trend: 'down',
      volatility: 'high',
      forecast: 'stable',
      suppliers: 15
    },
    {
      name: 'Tomatoes',
      category: 'Vegetables',
      currentPrice: 35,
      previousPrice: 32,
      change: 9.4,
      unit: 'kg',
      trend: 'up',
      volatility: 'medium',
      forecast: 'rising',
      suppliers: 12
    },
    {
      name: 'Rice (Basmati)',
      category: 'Grains',
      currentPrice: 85,
      previousPrice: 82,
      change: 3.7,
      unit: 'kg',
      trend: 'up',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 8
    },
    {
      name: 'Cooking Oil',
      category: 'Oils',
      currentPrice: 180,
      previousPrice: 185,
      change: -2.7,
      unit: '15L',
      trend: 'down',
      volatility: 'low',
      forecast: 'falling',
      suppliers: 6
    },
    {
      name: 'Turmeric Powder',
      category: 'Spices',
      currentPrice: 420,
      previousPrice: 410,
      change: 2.4,
      unit: 'kg',
      trend: 'up',
      volatility: 'medium',
      forecast: 'stable',
      suppliers: 10
    },
    {
      name: 'Wheat Flour',
      category: 'Grains',
      currentPrice: 32,
      previousPrice: 34,
      change: -5.9,
      unit: 'kg',
      trend: 'down',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 14
    },
    {
      name: 'Potatoes',
      category: 'Vegetables',
      currentPrice: 28,
      previousPrice: 25,
      change: 12.0,
      unit: 'kg',
      trend: 'up',
      volatility: 'high',
      forecast: 'rising',
      suppliers: 18
    },
    {
      name: 'Apples',
      category: 'Fruits',
      currentPrice: 150,
      previousPrice: 145,
      change: 3.4,
      unit: 'kg',
      trend: 'up',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 9
    },
    {
      name: 'Chili Powder',
      category: 'Spices',
      currentPrice: 380,
      previousPrice: 395,
      change: -3.8,
      unit: 'kg',
      trend: 'down',
      volatility: 'medium',
      forecast: 'falling',
      suppliers: 11
    },
    {
      name: 'Toor Dal',
      category: 'Pulses',
      currentPrice: 125,
      previousPrice: 130,
      change: -3.8,
      unit: 'kg',
      trend: 'down',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 7
    },
    {
      name: 'Milk',
      category: 'Dairy',
      currentPrice: 55,
      previousPrice: 52,
      change: 5.8,
      unit: '1L',
      trend: 'up',
      volatility: 'low',
      forecast: 'rising',
      suppliers: 13
    },
    {
      name: 'Bananas',
      category: 'Fruits',
      currentPrice: 45,
      previousPrice: 48,
      change: -6.3,
      unit: 'dozen',
      trend: 'down',
      volatility: 'medium',
      forecast: 'stable',
      suppliers: 16
    },
    {
      name: 'Coriander Seeds',
      category: 'Spices',
      currentPrice: 320,
      previousPrice: 310,
      change: 3.2,
      unit: 'kg',
      trend: 'up',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 8
    },
    {
      name: 'Mustard Oil',
      category: 'Oils',
      currentPrice: 165,
      previousPrice: 170,
      change: -2.9,
      unit: '1L',
      trend: 'down',
      volatility: 'low',
      forecast: 'falling',
      suppliers: 5
    },
    {
      name: 'Moong Dal',
      category: 'Pulses',
      currentPrice: 110,
      previousPrice: 105,
      change: 4.8,
      unit: 'kg',
      trend: 'up',
      volatility: 'medium',
      forecast: 'rising',
      suppliers: 9
    },
    {
      name: 'Paneer',
      category: 'Dairy',
      currentPrice: 280,
      previousPrice: 275,
      change: 1.8,
      unit: 'kg',
      trend: 'up',
      volatility: 'low',
      forecast: 'stable',
      suppliers: 6
    }
  ];

  const filteredData = marketData.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleFindSuppliers = (productName: string) => {
    setSelectedProduct(productName);
    setSupplierModalOpen(true);
  };

  const handleSetAlert = async (productName: string, currentPrice: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to set price alerts.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Setting alert for: ${productName} at price: ₹${currentPrice}`);
    
    const result = await addAlert(productName, currentPrice);
    
    if (result) {
      setConfettiProduct(productName);
      setShowConfetti(true);
      console.log(`Alert successfully created for: ${productName}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
    setConfettiProduct('');
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up') return change > 5 ? 'text-red-600' : 'text-green-600';
    return change < -5 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendBg = (trend: string, change: number) => {
    if (trend === 'up') return change > 5 ? 'bg-red-100' : 'bg-green-100';
    return change < -5 ? 'bg-green-100' : 'bg-red-100';
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lemon via-lemon/50 to-wisteria/30">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-black mb-4">
              <span className="text-[#59D35D]">MARKET</span> RATES
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Track live prices, trends, and forecasts for all your ingredients
            </p>
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-r from-wisteria/20 to-lemon/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-wisteria/30">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Period Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Period</label>
                <div className="flex gap-2">
                  {periods.map(period => (
                    <Button
                      key={period.value}
                      variant={selectedPeriod === period.value ? "default" : "outline"}
                      onClick={() => setSelectedPeriod(period.value)}
                      className={selectedPeriod === period.value 
                        ? "bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold" 
                        : "border-2 border-wisteria/50 bg-white/80 font-bold hover:bg-wisteria/10"
                      }
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      size="sm"
                      className={selectedCategory === category 
                        ? "bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold" 
                        : "border-2 border-wisteria/50 bg-white/80 font-bold hover:bg-wisteria/10"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-white to-lemon/30 backdrop-blur-sm border-2 border-wisteria/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-green-600">12</div>
                <div className="text-sm font-semibold text-gray-600">Items Rising</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white to-wisteria/30 backdrop-blur-sm border-2 border-wisteria/20">
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-red-600">8</div>
                <div className="text-sm font-semibold text-gray-600">Items Falling</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-lemon/40 to-white backdrop-blur-sm border-2 border-wisteria/20">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-yellow-600">3</div>
                <div className="text-sm font-semibold text-gray-600">High Volatility</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-wisteria/30 to-white backdrop-blur-sm border-2 border-wisteria/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-blue-600">16</div>
                <div className="text-sm font-semibold text-gray-600">Total Items Tracked</div>
              </CardContent>
            </Card>
          </div>

          {/* Price Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => (
              <Card key={item.name} className="bg-white border-2 border-wisteria/30 hover:shadow-xl hover:border-wisteria/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-black text-black mb-1">
                        {item.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs font-semibold mb-2 border-wisteria/40 text-wisteria bg-wisteria/10">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-sm font-bold p-2 rounded-lg ${getTrendBg(item.trend, item.change)}`}>
                        {item.trend === 'up' ? (
                          <TrendingUp className={`h-4 w-4 mr-1 ${getTrendColor(item.trend, item.change)}`} />
                        ) : (
                          <TrendingDown className={`h-4 w-4 mr-1 ${getTrendColor(item.trend, item.change)}`} />
                        )}
                        <span className={getTrendColor(item.trend, item.change)}>
                          {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Price Display */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-black text-black">₹{item.currentPrice}</span>
                      <span className="text-sm font-semibold text-gray-500">per {item.unit}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Previous: ₹{item.previousPrice}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Volatility:</span>
                      <Badge className={getVolatilityColor(item.volatility)}>
                        {item.volatility}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Forecast:</span>
                      <span className="text-sm font-bold text-gray-800 capitalize">{item.forecast}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Suppliers:</span>
                      <span className="text-sm font-bold text-[#59D35D]">{item.suppliers} available</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#59D35D] hover:bg-[#4BC44F] text-black font-bold"
                      onClick={() => handleFindSuppliers(item.name)}
                    >
                      Find Suppliers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-2 border-wisteria/50 font-bold hover:bg-wisteria/10"
                      onClick={() => handleSetAlert(item.name, item.currentPrice)}
                    >
                      Set Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Insights */}
          <div className="mt-12">
            <h2 className="text-3xl font-black text-black mb-6">Market Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-green-400 to-green-500 border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-white mb-2">Best Time to Buy</h3>
                  <p className="text-green-100 mb-4">
                    Onion prices are expected to drop 15% in the next 3 days. Consider bulk purchasing.
                  </p>
                  <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold">
                    View Recommendations
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-wisteria to-wisteria/80 border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-black text-white mb-2">Price Alert</h3>
                  <p className="text-white/90 mb-4">
                    Cooking oil prices showing unusual volatility. Monitor closely for bulk orders.
                  </p>
                  <Button className="bg-white text-wisteria hover:bg-gray-100 font-bold">
                    Set Price Alert
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Effects */}
      <SupplierModal 
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        productName={selectedProduct}
      />
      
      {showConfetti && (
        <ConfettiAlert 
          productName={confettiProduct}
          onComplete={handleConfettiComplete}
        />
      )}
    </div>
  );
};

export default Market;
