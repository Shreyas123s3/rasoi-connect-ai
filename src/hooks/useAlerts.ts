
import { useState, useEffect } from 'react';

export interface Alert {
  id: string;
  productName: string;
  currentPrice: number;
  priceThreshold?: number;
  timestamp: Date;
  isActive: boolean;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load alerts from localStorage on initialization
  useEffect(() => {
    const savedAlerts = localStorage.getItem('marketAlerts');
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts).map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));
      setAlerts(parsedAlerts);
    }
  }, []);

  const addAlert = (productName: string, currentPrice: number, priceThreshold?: number) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      productName,
      currentPrice,
      priceThreshold: priceThreshold || currentPrice * 0.9, // Default to 10% below current price
      timestamp: new Date(),
      isActive: true
    };
    
    const updatedAlerts = [newAlert, ...alerts];
    setAlerts(updatedAlerts);
    
    // Store in localStorage for persistence
    localStorage.setItem('marketAlerts', JSON.stringify(updatedAlerts));
    
    return newAlert;
  };

  return { alerts, addAlert };
};
