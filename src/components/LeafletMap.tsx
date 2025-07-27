
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData } from '@/hooks/useGeolocation';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface Supplier {
  id: number;
  name: string;
  lat: number;
  lon: number;
  status: 'open' | 'closed';
  categories: string[];
  distance?: number;
}

interface LeafletMapProps {
  userLocation: LocationData | null;
  suppliers: Supplier[];
  onSupplierClick: (supplier: Supplier) => void;
  selectedSupplier: Supplier | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  userLocation, 
  suppliers, 
  onSupplierClick, 
  selectedSupplier 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current && userLocation) {
      // Initialize map
      mapRef.current = L.map('map', {
        center: [userLocation.lat, userLocation.lon],
        zoom: 13,
        zoomControl: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation]);

  // Update user marker
  useEffect(() => {
    if (mapRef.current && userLocation) {
      if (userMarkerRef.current) {
        mapRef.current.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        html: '<div class="user-marker">📍</div>',
        className: 'user-marker-container',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lon], { 
        icon: userIcon 
      })
        .addTo(mapRef.current)
        .bindPopup('You are here')
        .openPopup();

      // Center map on user location
      mapRef.current.setView([userLocation.lat, userLocation.lon], 13);
    }
  }, [userLocation]);

  // Update supplier markers
  useEffect(() => {
    if (mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapRef.current?.removeLayer(marker);
      });
      markersRef.current = [];

      // Add supplier markers
      suppliers.forEach(supplier => {
        const isOpen = supplier.status === 'open';
        const markerColor = isOpen ? 'green' : 'red';
        
        const supplierIcon = L.divIcon({
          html: `<div class="supplier-marker ${markerColor}">📍</div>`,
          className: 'supplier-marker-container',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([supplier.lat, supplier.lon], { 
          icon: supplierIcon 
        })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div class="supplier-popup">
              <h3 class="font-bold text-lg">${supplier.name}</h3>
              <p class="text-sm text-gray-600">${supplier.categories.join(', ')}</p>
              <p class="text-sm font-semibold">${supplier.distance?.toFixed(1)}km away</p>
              <p class="text-sm">Status: <span class="font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}">${isOpen ? 'Open' : 'Closed'}</span></p>
              <button class="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm font-bold hover:bg-green-600">View Products</button>
            </div>`
          )
          .on('click', () => {
            onSupplierClick(supplier);
          });

        markersRef.current.push(marker);

        // Highlight selected supplier
        if (selectedSupplier?.id === supplier.id) {
          marker.openPopup();
        }
      });
    }
  }, [suppliers, selectedSupplier, onSupplierClick]);

  return (
    <div className="relative">
      <div id="map" className="w-full h-[500px] rounded-lg border-2 border-white/30 shadow-lg"></div>
      <style jsx>{`
        .user-marker-container {
          background: transparent;
          border: none;
        }
        .user-marker {
          font-size: 24px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.8));
        }
        .supplier-marker-container {
          background: transparent;
          border: none;
        }
        .supplier-marker {
          font-size: 20px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .supplier-marker.green {
          filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.8));
        }
        .supplier-marker.red {
          filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.8));
        }
        .supplier-popup {
          min-width: 200px;
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
