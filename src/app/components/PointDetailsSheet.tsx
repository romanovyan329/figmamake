import { Ship, MapPin, Anchor, Fuel, AlertTriangle, Navigation, Bookmark, X } from 'lucide-react';
import { MapPoint } from '../data/mockData';
import { calculateDistance, getCompassDirection } from '../utils/navigationUtils';

interface PointDetailsSheetProps {
  point: MapPoint;
  userLocation: [number, number];
  onNavigate: (point: MapPoint) => void;
  onSave: (point: MapPoint) => void;
  onClose: () => void;
  isSaved?: boolean;
}

export function PointDetailsSheet({ 
  point, 
  userLocation, 
  onNavigate, 
  onSave, 
  onClose,
  isSaved = false 
}: PointDetailsSheetProps) {
  const getPointIcon = (type: MapPoint['type']) => {
    switch (type) {
      case 'marina': return Ship;
      case 'port': return Ship;
      case 'anchorage': return Anchor;
      case 'fuel': return Fuel;
      case 'danger': return AlertTriangle;
      default: return MapPin;
    }
  };

  const getPointColor = (type: MapPoint['type']) => {
    switch (type) {
      case 'marina': return 'bg-blue-500';
      case 'port': return 'bg-indigo-500';
      case 'anchorage': return 'bg-green-500';
      case 'fuel': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const Icon = getPointIcon(point.type);
  const distance = calculateDistance(userLocation[0], userLocation[1], point.lat, point.lng);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 -z-10 bg-black/50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="rounded-t-3xl bg-slate-900 px-6 pb-8 pt-4 shadow-2xl">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-700" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`flex size-16 shrink-0 items-center justify-center rounded-full ${getPointColor(point.type)}`}>
              <Icon className="size-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{point.name}</h2>
              <p className="mt-1 text-slate-400">{point.description}</p>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 rounded-full p-2 transition-colors active:bg-slate-800"
            >
              <X className="size-5 text-slate-400" />
            </button>
          </div>

          {/* Info Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
              <span className="text-sm text-slate-400">Coordinates</span>
              <span className="font-mono text-sm font-medium text-white">
                {point.lat.toFixed(4)}°, {point.lng.toFixed(4)}°
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3">
              <span className="text-sm text-slate-400">Distance</span>
              <span className="text-sm font-semibold text-cyan-400">{distance} nm</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate(point)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-semibold text-white transition-colors active:bg-cyan-600"
            >
              <Navigation className="size-5" />
              Navigate
            </button>

            <button
              onClick={() => onSave(point)}
              className={`flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold transition-colors ${
                isSaved 
                  ? 'bg-slate-700 text-slate-400' 
                  : 'bg-slate-800 text-white active:bg-slate-700'
              }`}
              disabled={isSaved}
            >
              <Bookmark className={`size-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
