import { useState, useEffect } from 'react';
import { Route, Navigation, Clock, Plus, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { savedRoutes as initialSavedRoutes, mapPoints as initialMapPoints, MapPoint, Route as RouteType } from '../data/mockData';
import { RouteBuilder } from '../components/RouteBuilder';

export function RoutesPageMobile() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(() => {
    const saved = localStorage.getItem('mapPoints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load map points:', e);
      }
    }
    return initialMapPoints;
  });
  const [savedRoutes, setSavedRoutes] = useState<RouteType[]>(() => {
    const saved = localStorage.getItem('savedRoutes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load routes:', e);
      }
    }
    return initialSavedRoutes;
  });

  // Reload map points when RouteBuilder closes
  useEffect(() => {
    if (!showRouteBuilder) {
      const savedPoints = localStorage.getItem('mapPoints');
      if (savedPoints) {
        try {
          setMapPoints(JSON.parse(savedPoints));
        } catch (e) {
          console.error('Failed to load map points:', e);
        }
      }
      
      const savedRoutesData = localStorage.getItem('savedRoutes');
      if (savedRoutesData) {
        try {
          setSavedRoutes(JSON.parse(savedRoutesData));
        } catch (e) {
          console.error('Failed to load routes:', e);
        }
      }
    }
  }, [showRouteBuilder]);

  const getPointName = (pointId: string) => {
    const point = mapPoints.find(p => p.id === pointId);
    return point?.name || 'Unknown';
  };

  const handleStartNavigation = (routeId: string) => {
    // Save selected route to localStorage for the map to use
    localStorage.setItem('activeRoute', routeId);
    // Navigate to map
    navigate('/map');
  };

  const selectedRouteData = savedRoutes.find(r => r.id === selectedRoute);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="space-y-6 px-6 pb-6 pt-16">
        {/* Title */}
        <h1 className="text-xl font-semibold text-white">Routes</h1>

        {/* Create Route Button */}
        <button 
          onClick={() => setShowRouteBuilder(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-semibold transition-colors active:bg-cyan-600"
        >
          <Plus className="size-5" />
          Create New Route
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">{savedRoutes.length}</div>
            <div className="text-xs text-slate-400">Routes</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">
              {savedRoutes.reduce((sum, r) => sum + r.distance, 0).toFixed(0)}
            </div>
            <div className="text-xs text-slate-400">Total NM</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">
              {(savedRoutes.reduce((sum, r) => sum + r.estimatedTime, 0) / savedRoutes.length).toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">Avg Hours</div>
          </div>
        </div>

        {/* Routes List */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">Saved Routes</h2>
          
          <div className="space-y-3">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="w-full rounded-xl bg-slate-900 p-4 text-left transition-colors"
              >
                <button
                  onClick={() => setSelectedRoute(route.id === selectedRoute ? null : route.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{route.name}</div>
                      
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="size-3" />
                        <span>{getPointName(route.points[0])}</span>
                        <ChevronRight className="size-3" />
                        <span>{getPointName(route.points[route.points.length - 1])}</span>
                      </div>

                      <div className="mt-3 flex gap-4 text-sm">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Navigation className="size-4" />
                          <span>{route.distance} nm</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="size-4" />
                          <span>~{route.estimatedTime}h</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`size-5 text-slate-500 transition-transform ${selectedRoute === route.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded Details */}
                {selectedRoute === route.id && (
                  <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
                    <div>
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Waypoints</div>
                      <div className="space-y-2">
                        {route.points.map((pointId, index) => {
                          const point = mapPoints.find(p => p.id === pointId);
                          if (!point) return null;
                          
                          return (
                            <div key={`${route.id}-detail-${pointId}-${index}`} className="flex items-center gap-3">
                              <div className="flex size-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{point.name}</div>
                                <div className="text-xs text-slate-500">
                                  {point.lat.toFixed(4)}°, {point.lng.toFixed(4)}°
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-800 p-3">
                        <div className="text-xs text-slate-400">Speed</div>
                        <div className="text-sm font-semibold">10 knots</div>
                      </div>
                      <div className="rounded-lg bg-slate-800 p-3">
                        <div className="text-xs text-slate-400">Fuel</div>
                        <div className="text-sm font-semibold">~{(route.estimatedTime * 28).toFixed(0)} L</div>
                      </div>
                    </div>

                    <button 
                      className="w-full rounded-xl bg-cyan-500 py-3 font-semibold transition-colors active:bg-cyan-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNavigation(route.id);
                      }}
                    >
                      Start Navigation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Builder */}
      {showRouteBuilder && (
        <RouteBuilder points={mapPoints} onClose={() => setShowRouteBuilder(false)} />
      )}
    </div>
  );
}