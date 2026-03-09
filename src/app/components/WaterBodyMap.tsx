import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix для маркеров Leaflet с правильными путями
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface WaterBodyMapProps {
  coordinates: { lat: number; lng: number };
  waterBodyName: string;
}

export function WaterBodyMap({ coordinates, waterBodyName }: WaterBodyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add marker
    L.marker([coordinates.lat, coordinates.lng])
      .addTo(map)
      .bindPopup(`<b>${waterBodyName}</b>`)
      .openPopup();

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates.lat, coordinates.lng, waterBodyName]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-xl overflow-hidden shadow-md"
      style={{ zIndex: 0 }}
    />
  );
}