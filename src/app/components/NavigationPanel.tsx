import { Navigation, Clock, Compass, X } from 'lucide-react';
import { MapPoint } from '../data/mockData';
import { calculateDistance, calculateHeading, calculateETA, getCompassDirection, formatTime } from '../utils/navigationUtils';

interface NavigationPanelProps {
  destination: MapPoint;
  userLocation: [number, number];
  averageSpeed?: number; // knots
  onClose: () => void;
}

export function NavigationPanel({ 
  destination, 
  userLocation, 
  averageSpeed = 10,
  onClose 
}: NavigationPanelProps) {
  const distance = calculateDistance(userLocation[0], userLocation[1], destination.lat, destination.lng);
  const heading = calculateHeading(userLocation[0], userLocation[1], destination.lat, destination.lng);
  const eta = calculateETA(distance, averageSpeed);
  const compassDirection = getCompassDirection(heading);

  return (
    <div className="fixed left-0 right-0 top-[56px] z-40 mx-4 animate-slide-down">
      <div className="rounded-2xl bg-slate-900 p-4 shadow-2xl ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-cyan-400">
              Navigating to
            </div>
            <div className="mt-1 text-lg font-semibold text-white">{destination.name}</div>
          </div>
          
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-2 transition-colors active:bg-slate-800"
          >
            <X className="size-5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Stats */}
        <div className="grid grid-cols-3 gap-3">
          {/* Distance */}
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="flex items-center gap-2">
              <Navigation className="size-4 text-cyan-400" />
              <div className="text-xs text-slate-400">Distance</div>
            </div>
            <div className="mt-1 text-xl font-bold text-white">{distance}</div>
            <div className="text-xs text-slate-500">nm</div>
          </div>

          {/* ETA */}
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-blue-400" />
              <div className="text-xs text-slate-400">ETA</div>
            </div>
            <div className="mt-1 text-xl font-bold text-white">{formatTime(eta)}</div>
            <div className="text-xs text-slate-500">@ {averageSpeed} kts</div>
          </div>

          {/* Heading */}
          <div className="rounded-xl bg-slate-800 p-3">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-green-400" />
              <div className="text-xs text-slate-400">Heading</div>
            </div>
            <div className="mt-1 text-xl font-bold text-white">{heading}°</div>
            <div className="text-xs text-slate-500">{compassDirection}</div>
          </div>
        </div>

        {/* Stop Navigation Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-red-500/10 py-3 font-semibold text-red-400 transition-colors active:bg-red-500/20"
        >
          Stop Navigation
        </button>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}