import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Anchor, Fuel, AlertTriangle, Ship } from 'lucide-react';
import { MapPoint } from '../data/mockData';

interface MarineMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  onPointClick?: (point: MapPoint) => void;
  onCenterChange?: (center: [number, number]) => void;
  onZoomChange?: (zoom: number) => void;
  isAddingPoint?: boolean;
  onMapClick?: (coordinates: [number, number]) => void;
  navigationRoute?: {
    start: [number, number];
    end: [number, number];
  } | null;
  userLocation?: [number, number];
  routePoints?: [number, number][] | null;
}

// Get color for point type
const getPointColor = (type: MapPoint['type']) => {
  switch (type) {
    case 'marina': return '#3b82f6'; // blue-500
    case 'port': return '#6366f1'; // indigo-500
    case 'anchorage': return '#22c55e'; // green-500
    case 'fuel': return '#f97316'; // orange-500
    case 'danger': return '#ef4444'; // red-500
    default: return '#64748b'; // slate-500
  }
};

// Create custom marker icon as HTML
const createMarkerIcon = (type: MapPoint['type']) => {
  const color = getPointColor(type);
  
  // Icon SVG based on type
  let iconSvg = '';
  switch (type) {
    case 'marina':
    case 'port':
      iconSvg = '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>';
      break;
    case 'anchorage':
      iconSvg = '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>';
      break;
    case 'fuel':
      iconSvg = '<path d="M3 22h12M4 9h10M19 17V3.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5V17M8 13v5M5 17h8a2 2 0 0 0 2-2v-2.5M19 9l2 1.5v3L19 15"/>';
      break;
    case 'danger':
      iconSvg = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>';
      break;
    default:
      iconSvg = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
  }
  
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
        cursor: pointer;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${iconSvg}
        </svg>
      </div>
    `,
    className: 'marine-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Create user location marker with pulsing animation
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <!-- Pulsing ring -->
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          background: rgba(6, 182, 212, 0.3);
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <!-- Inner dot -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #06b6d4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      </style>
    `,
    className: 'user-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export function MarineMap({ 
  points, 
  center = [46.4825, 30.7233], 
  zoom = 12, 
  onPointClick,
  onCenterChange,
  onZoomChange,
  isAddingPoint = false,
  onMapClick,
  navigationRoute,
  userLocation,
  routePoints,
}: MarineMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigationLineRef = useRef<L.Polyline | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const isAddingPointRef = useRef(isAddingPoint);

  // Keep ref updated with current value
  useEffect(() => {
    isAddingPointRef.current = isAddingPoint;
  }, [isAddingPoint]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(containerRef.current, {
      center: center as L.LatLngExpression,
      zoom: zoom,
      zoomControl: false, // We'll use our custom zoom controls
      minZoom: 3,
      maxZoom: 18,
    });

    // Add OpenStreetMap tiles - standard layer
    const osmStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    });

    // Add OpenSeaMap overlay for nautical features (optional)
    const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      attribution: '© OpenSeaMap contributors',
      maxZoom: 18,
    });

    // Add base layer
    osmStandard.addTo(map);
    
    // Add sea marks overlay
    seaMarks.addTo(map);

    // Event listeners
    map.on('moveend', () => {
      const center = map.getCenter();
      onCenterChange?.([center.lat, center.lng]);
    });

    map.on('zoomend', () => {
      onZoomChange?.(map.getZoom());
    });

    map.on('click', (e) => {
      console.log('Leaflet map click event fired!');
      console.log('isAddingPointRef.current:', isAddingPointRef.current);
      console.log('Coordinates:', e.latlng.lat, e.latlng.lng);
      if (isAddingPointRef.current) {
        console.log('Calling onMapClick callback');
        onMapClick?.([e.latlng.lat, e.latlng.lng]);
      }
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Only run once on mount

  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    
    // Only update if values are different to avoid infinite loops
    if (Math.abs(currentCenter.lat - center[0]) > 0.0001 || 
        Math.abs(currentCenter.lng - center[1]) > 0.0001 ||
        currentZoom !== zoom) {
      map.setView(center as L.LatLngExpression, zoom, { animate: true });
    }
  }, [center, zoom]);

  // Update cursor style based on isAddingPoint
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (isAddingPointRef.current) {
      containerRef.current.style.cursor = 'crosshair';
    } else {
      containerRef.current.style.cursor = '';
    }
  }, [isAddingPoint]);

  // Update markers when points change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createMarkerIcon(point.type),
      });

      // Add popup
      const popupContent = `
        <div style="font-family: system-ui; min-width: 150px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${point.name}</div>
          <div style="font-size: 12px; color: #64748b; text-transform: capitalize;">${point.type}</div>
        </div>
      `;
      
      marker.bindPopup(popupContent);

      // Click handler
      marker.on('click', () => {
        onPointClick?.(point);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [points, isMapReady, onPointClick]);

  // Update navigation route when props change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    // Clear existing navigation line
    if (navigationLineRef.current) {
      map.removeLayer(navigationLineRef.current);
      navigationLineRef.current = null;
    }

    // Add new navigation line if route is provided
    if (navigationRoute) {
      const line = L.polyline([navigationRoute.start, navigationRoute.end], {
        color: '#3b82f6', // blue-500
        weight: 5,
        opacity: 0.75,
        smoothFactor: 1,
      });

      line.addTo(map);
      navigationLineRef.current = line;
    }
  }, [navigationRoute, isMapReady]);

  // Update user location marker when props change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    // Clear existing user location marker
    if (userLocationMarkerRef.current) {
      map.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }

    // Add new user location marker if location is provided
    if (userLocation) {
      const marker = L.marker(userLocation, {
        icon: createUserLocationIcon(),
      });

      marker.addTo(map);
      userLocationMarkerRef.current = marker;
    }
  }, [userLocation, isMapReady]);

  // Update route line when routePoints change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    // Clear existing route line
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    // Add new route line if routePoints are provided
    if (routePoints && routePoints.length > 1) {
      const line = L.polyline(routePoints, {
        color: '#06b6d4', // cyan-500
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        dashArray: '10, 5',
      });

      line.addTo(map);
      routeLineRef.current = line;
    }
  }, [routePoints, isMapReady]);

  return (
    <div className="relative h-full w-full">
      {/* Leaflet Map Container */}
      <div 
        ref={containerRef} 
        className="h-full w-full"
        style={{ background: '#1e293b', touchAction: 'pan-x pan-y' }}
        onClick={(e) => {
          console.log('Container div clicked directly!');
        }}
      />
      
      {/* Map Info Overlay */}
      <div className="pointer-events-none absolute left-4 top-20 z-[1000] rounded-lg bg-slate-900/90 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="size-4" />
          <span>OpenStreetMap</span>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {center[0].toFixed(4)}°, {center[1].toFixed(4)}°
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Zoom: {zoom.toFixed(1)}
        </div>
      </div>

      {/* Attribution */}
      <div className="pointer-events-none absolute bottom-2 right-2 z-[1000] rounded bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400 backdrop-blur-sm">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}