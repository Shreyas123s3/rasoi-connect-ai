
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface ConfettiAlertProps {
  productName: string;
  onComplete: () => void;
}

const ConfettiAlert: React.FC<ConfettiAlertProps> = ({ productName, onComplete }) => {
  const { toast } = useToast();

  useEffect(() => {
    // Trigger confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        onComplete();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);

    // Show toast message
    toast({
      title: "Alert Set Successfully! 🎉",
      description: `Alert for ${productName} has been set successfully!`,
      duration: 3000,
    });

    return () => clearInterval(interval);
  }, [productName, onComplete, toast]);

  return null;
};

export default ConfettiAlert;
