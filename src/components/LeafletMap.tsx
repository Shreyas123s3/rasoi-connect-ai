
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
  price: number;
  unit: string;
  minimumOrder: number;
  delivery: boolean;
  pickup: boolean;
  phone: string;
  rating: number;
  totalOrders: number;
  description: string;
}

export interface BulkOrder {
  id: string;
  title: string;
  lat: number;
  lon: number;
  distance?: number;
  target_price: number;
  current_price: number;
  minimum_quantity: number;
  current_participants: number;
  target_participants: number;
  location: string;
  description?: string;
  expires_at: string;
}

interface LeafletMapProps {
  userLocation: LocationData | null;
  suppliers: Supplier[];
  bulkOrders: BulkOrder[];
  onSupplierClick: (supplier: Supplier) => void;
  onBulkOrderClick: (bulkOrder: BulkOrder) => void;
  selectedSupplier: Supplier | null;
  selectedBulkOrder: BulkOrder | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  userLocation, 
  suppliers, 
  bulkOrders,
  onSupplierClick, 
  onBulkOrderClick,
  selectedSupplier,
  selectedBulkOrder
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const supplierMarkersRef = useRef<L.Marker[]>([]);
  const bulkOrderMarkersRef = useRef<L.Marker[]>([]);
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
      // Clear existing supplier markers
      supplierMarkersRef.current.forEach(marker => {
        mapRef.current?.removeLayer(marker);
      });
      supplierMarkersRef.current = [];

      // Add supplier markers
      suppliers.forEach(supplier => {
        const isOpen = supplier.status === 'open';
        const markerColor = isOpen ? 'green' : 'red';
        
        const supplierIcon = L.divIcon({
          html: `<div class="supplier-marker ${markerColor}">🏪</div>`,
          className: 'supplier-marker-container',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });

        const deliveryText = supplier.delivery ? (supplier.pickup ? 'Delivery & Pickup' : 'Delivery Only') : 'Pickup Only';

        const marker = L.marker([supplier.lat, supplier.lon], { 
          icon: supplierIcon 
        })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div class="supplier-popup">
              <h3 class="font-bold text-lg">${supplier.name}</h3>
              <p class="text-sm text-gray-600">${supplier.categories.join(', ')}</p>
              <p class="text-sm font-semibold">₹${supplier.price}/${supplier.unit}</p>
              <p class="text-sm">Min Order: ${supplier.minimumOrder}${supplier.unit}</p>
              <p class="text-sm">${deliveryText}</p>
              <p class="text-sm font-semibold">${supplier.distance?.toFixed(1)}km away</p>
              <p class="text-sm">Status: <span class="font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}">${isOpen ? 'Open' : 'Closed'}</span></p>
              <p class="text-sm">⭐ ${supplier.rating} (${supplier.totalOrders} orders)</p>
              <div class="mt-2">
                <button class="px-3 py-1 bg-green-500 text-white rounded text-sm font-bold hover:bg-green-600 mr-2">Call: ${supplier.phone}</button>
                <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold hover:bg-blue-600">WhatsApp</button>
              </div>
            </div>`
          )
          .on('click', () => {
            onSupplierClick(supplier);
          });

        supplierMarkersRef.current.push(marker);

        // Highlight selected supplier
        if (selectedSupplier?.id === supplier.id) {
          marker.openPopup();
        }
      });
    }
  }, [suppliers, selectedSupplier, onSupplierClick]);

  // Update bulk order markers
  useEffect(() => {
    if (mapRef.current) {
      // Clear existing bulk order markers
      bulkOrderMarkersRef.current.forEach(marker => {
        mapRef.current?.removeLayer(marker);
      });
      bulkOrderMarkersRef.current = [];

      // Add bulk order markers
      bulkOrders.forEach(order => {
        const participationRate = (order.current_participants / order.target_participants) * 100;
        const markerColor = participationRate >= 80 ? 'green' : participationRate >= 50 ? 'orange' : 'purple';
        
        const bulkOrderIcon = L.divIcon({
          html: `<div class="bulk-order-marker ${markerColor}">🛒</div>`,
          className: 'bulk-order-marker-container',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });

        const timeLeft = new Date(order.expires_at).getTime() - new Date().getTime();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

        const marker = L.marker([order.lat, order.lon], { 
          icon: bulkOrderIcon 
        })
          .addTo(mapRef.current!)
          .bindPopup(
            `<div class="bulk-order-popup">
              <h3 class="font-bold text-lg">🛒 ${order.title}</h3>
              <p class="text-sm text-gray-600">Target: ${order.minimum_quantity} units @ ₹${order.target_price}</p>
              <p class="text-sm">Current: ₹${order.current_price}</p>
              <p class="text-sm font-semibold">Participants: ${order.current_participants}/${order.target_participants}</p>
              <p class="text-sm">${order.distance?.toFixed(1)}km away</p>
              <p class="text-sm">Expires in ${daysLeft} days</p>
              ${order.description ? `<p class="text-sm text-gray-600">${order.description}</p>` : ''}
              <button class="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm font-bold hover:bg-purple-600">Join Order</button>
            </div>`
          )
          .on('click', () => {
            onBulkOrderClick(order);
          });

        bulkOrderMarkersRef.current.push(marker);

        // Highlight selected bulk order
        if (selectedBulkOrder?.id === order.id) {
          marker.openPopup();
        }
      });
    }
  }, [bulkOrders, selectedBulkOrder, onBulkOrderClick]);

  return (
    <div className="relative">
      <div id="map" className="w-full h-[500px] rounded-lg border-2 border-white/30 shadow-lg"></div>
      <style>{`
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
        .bulk-order-marker-container {
          background: transparent;
          border: none;
        }
        .bulk-order-marker {
          font-size: 20px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .bulk-order-marker.purple {
          filter: drop-shadow(0 0 3px rgba(147, 51, 234, 0.8));
        }
        .bulk-order-marker.orange {
          filter: drop-shadow(0 0 3px rgba(249, 115, 22, 0.8));
        }
        .bulk-order-marker.green {
          filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.8));
        }
        .supplier-popup, .bulk-order-popup {
          min-width: 250px;
        }
        .supplier-popup h3, .bulk-order-popup h3 {
          margin-bottom: 8px;
        }
        .supplier-popup p, .bulk-order-popup p {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
