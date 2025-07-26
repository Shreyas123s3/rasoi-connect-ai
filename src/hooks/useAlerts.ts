
import { useState } from 'react';

export interface Alert {
  id: string;
  productName: string;
  timestamp: Date;
  isActive: boolean;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (productName: string) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      productName,
      timestamp: new Date(),
      isActive: true
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Store in localStorage for persistence
    const savedAlerts = localStorage.getItem('marketAlerts');
    const existingAlerts = savedAlerts ? JSON.parse(savedAlerts) : [];
    localStorage.setItem('marketAlerts', JSON.stringify([newAlert, ...existingAlerts]));
    
    return newAlert;
  };

  return { alerts, addAlert };
};
