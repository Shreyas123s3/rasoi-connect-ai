
import React from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLivePriceTracker } from '@/hooks/useLivePriceTracker';
import { SupabaseAlert } from '@/hooks/useSupabaseAlerts';

interface LivePriceTrackerProps {
  alerts: SupabaseAlert[];
}

const LivePriceTracker: React.FC<LivePriceTrackerProps> = ({ alerts }) => {
  const { livePrices, isTracking, updateAllPrices } = useLivePriceTracker(alerts);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-lemon/30 backdrop-blur-sm border-2 border-wisteria/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black text-black flex items-center">
            <Activity className="h-5 w-5 mr-2 text-wisteria" />
            Live Price Tracker
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={updateAllPrices}
            disabled={isTracking}
            className="border-2 border-wisteria/40 hover:bg-wisteria/10"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isTracking ? 'animate-spin' : ''}`} />
            {isTracking ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {livePrices.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No products to track</p>
            <p className="text-sm text-gray-500">Add alerts to start tracking live prices</p>
          </div>
        ) : (
          <div className="space-y-4">
            {livePrices.map((price, index) => (
              <div
                key={price.productName}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-lemon/20 to-wisteria/10 rounded-lg border-2 border-wisteria/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-lg text-black">{price.productName}</h3>
                    {getTrendIcon(price.trend)}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-black">
                      ₹{price.currentPrice}
                    </div>
                    <div className={`text-sm font-semibold ${getTrendColor(price.trend)}`}>
                      {price.trend === 'up' ? '+' : price.trend === 'down' ? '' : ''}
                      {price.priceChange}%
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge 
                    className={`mb-2 ${
                      price.trend === 'up' ? 'bg-green-100 text-green-800' :
                      price.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {price.trend === 'up' ? 'Rising' : price.trend === 'down' ? 'Falling' : 'Stable'}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    Updated {getTimeAgo(price.lastUpdated)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-wisteria/10 to-lemon/10 rounded-lg border border-wisteria/20">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700">Auto-refresh every 20 seconds</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceTracker;
