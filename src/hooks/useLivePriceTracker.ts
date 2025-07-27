
import { useState, useEffect, useCallback } from 'react';
import { SupabaseAlert } from './useSupabaseAlerts';

export interface LivePrice {
  productName: string;
  currentPrice: number;
  lastUpdated: Date;
  priceChange: number; // percentage change from previous price
  trend: 'up' | 'down' | 'stable';
}

export const useLivePriceTracker = (alerts: SupabaseAlert[]) => {
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Mock API call to simulate real-time price updates
  const fetchLivePrice = useCallback(async (productName: string, currentPrice: number): Promise<LivePrice> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate realistic price fluctuation (±5% from current price)
    const fluctuation = (Math.random() - 0.5) * 0.1; // -5% to +5%
    const newPrice = currentPrice * (1 + fluctuation);
    const priceChange = ((newPrice - currentPrice) / currentPrice) * 100;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (priceChange > 0.5) trend = 'up';
    else if (priceChange < -0.5) trend = 'down';
    
    return {
      productName,
      currentPrice: Math.round(newPrice * 100) / 100,
      lastUpdated: new Date(),
      priceChange: Math.round(priceChange * 100) / 100,
      trend
    };
  }, []);

  // Update prices for all tracked products
  const updateAllPrices = useCallback(async () => {
    if (alerts.length === 0) {
      setLivePrices([]);
      return;
    }

    setIsTracking(true);
    
    try {
      const updatedPrices = await Promise.all(
        alerts.map(alert => fetchLivePrice(alert.product_name, alert.current_price))
      );
      
      setLivePrices(updatedPrices);
    } catch (error) {
      console.error('Error updating prices:', error);
    } finally {
      setIsTracking(false);
    }
  }, [alerts, fetchLivePrice]);

  // Initial load and when alerts change
  useEffect(() => {
    updateAllPrices();
  }, [updateAllPrices]);

  // Set up polling every 20 seconds
  useEffect(() => {
    const interval = setInterval(updateAllPrices, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, [updateAllPrices]);

  return {
    livePrices,
    isTracking,
    updateAllPrices
  };
};
