
import { useState, useEffect } from 'react';

export interface LocationData {
  lat: number;
  lon: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      setLoading(false);
    };

    const error = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
      // Fallback to Mumbai coordinates
      setLocation({
        lat: 19.076,
        lon: 72.877
      });
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  }, []);

  return { location, loading, error };
};
