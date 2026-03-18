import { useState } from 'react';
import { X, MapPin, Navigation2, Anchor, Ship, Map as MapIcon, Clock, Gauge } from 'lucide-react';
import { MapPoint, Route as RouteType } from '../data/mockData';

interface RouteBuilderProps {
  onClose: () => void;
  points: MapPoint[];
}

type LocationSelectionMode = 'current' | 'map' | 'saved';

export function RouteBuilder({ onClose, points }: RouteBuilderProps) {
  const [routeName, setRouteName] = useState('');
  const [startPoint, setStartPoint] = useState<{ lat: number; lon: number; name?: string; id?: string } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lon: number; name?: string; id?: string } | null>(null);
  const [boatSpeed, setBoatSpeed] = useState('6');
  const [showStartOptions, setShowStartOptions] = useState(false);
  const [showDestOptions, setShowDestOptions] = useState(false);

  // Filter points for selection - add safety check
  const marinas = (points || []).filter(p => p.type === 'marina' || p.type === 'port');
  const anchorages = (points || []).filter(p => p.type === 'anchorage');
  const allPoints = points || [];

  // Calculate distance in nautical miles using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3440.065; // Earth's radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = startPoint && destination 
    ? calculateDistance(startPoint.lat, startPoint.lon, destination.lat, destination.lon)
    : 0;

  const travelTime = distance && boatSpeed 
    ? distance / parseFloat(boatSpeed)
    : 0;

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStartPoint({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Current Location'
          });
          setShowStartOptions(false);
        },
        (error) => {
          alert('Could not get your location. Please try another method.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSelectMarina = (point: MapPoint, type: 'start' | 'dest') => {
    const location = {
      lat: point.lat,
      lon: point.lng,
      name: point.name,
      id: point.id
    };

    if (type === 'start') {
      setStartPoint(location);
      setShowStartOptions(false);
    } else {
      setDestination(location);
      setShowDestOptions(false);
    }
  };

  const handlePreview = () => {
    if (!routeName.trim()) {
      alert('Please enter a route name');
      return;
    }
    if (!startPoint) {
      alert('Please select a start point');
      return;
    }
    if (!destination) {
      alert('Please select a destination');
      return;
    }
    alert('Route preview would show the route on the map. This is a preview feature.');
  };

  const handleSave = () => {
    if (!routeName.trim()) {
      alert('Please enter a route name');
      return;
    }
    if (!startPoint) {
      alert('Please select a start point');
      return;
    }
    if (!destination) {
      alert('Please select a destination');
      return;
    }

    // Create point IDs if they don't exist (for current location)
    const startId = startPoint.id || 'temp-start';
    const destId = destination.id || 'temp-dest';

    // Load existing routes from localStorage
    const savedRoutesStr = localStorage.getItem('savedRoutes');
    const existingRoutes: RouteType[] = savedRoutesStr ? JSON.parse(savedRoutesStr) : [];

    // Generate new route ID
    const newRouteId = String(existingRoutes.length + 1);

    // Create new route
    const newRoute: RouteType = {
      id: newRouteId,
      name: routeName,
      points: [startId, destId],
      distance: parseFloat(distance.toFixed(1)),
      estimatedTime: parseFloat(travelTime.toFixed(1)),
      created: new Date().toISOString().split('T')[0]
    };

    // Save to localStorage
    const updatedRoutes = [...existingRoutes, newRoute];
    localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));

    alert(`Route "${routeName}" saved!\n\nDistance: ${distance.toFixed(1)} nm\nEstimated time: ${travelTime.toFixed(1)} hours`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 pt-16">
          <h2 className="text-xl font-semibold text-white">Route Builder</h2>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-slate-800 transition-colors active:bg-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Route Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Route Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g. Weekend Sail to Paradise Bay"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Start Point */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Start Point <span className="text-red-400">*</span>
              </label>
              
              {startPoint ? (
                <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-500/20">
                      <MapPin className="size-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{startPoint.name || 'Custom Location'}</div>
                      <div className="text-sm text-slate-400">
                        {startPoint.lat.toFixed(4)}°, {startPoint.lon.toFixed(4)}°
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStartPoint(null)}
                    className="text-sm text-slate-400 transition-colors active:text-white"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowStartOptions(!showStartOptions)}
                    className="w-full rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Select start point...</span>
                      <MapPin className="size-5 text-slate-500" />
                    </div>
                  </button>

                  {showStartOptions && (
                    <div className="mt-3 space-y-2 rounded-xl bg-slate-900 p-3">
                      <button
                        onClick={handleUseCurrentLocation}
                        className="flex w-full items-center gap-3 rounded-lg bg-slate-800 p-3 text-left transition-colors active:bg-slate-700"
                      >
                        <Navigation2 className="size-5 text-cyan-400" />
                        <span className="text-sm font-medium">Use Current Location</span>
                      </button>

                      <div className="pt-2">
                        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                          Saved Marinas
                        </div>
                        <div className="max-h-48 space-y-1 overflow-y-auto">
                          {marinas.map((marina) => (
                            <button
                              key={marina.id}
                              onClick={() => handleSelectMarina(marina, 'start')}
                              className="flex w-full items-center gap-2 rounded-lg bg-slate-800 p-2 text-left transition-colors active:bg-slate-700"
                            >
                              <Ship className="size-4 text-blue-400" />
                              <span className="text-sm">{marina.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Destination <span className="text-red-400">*</span>
              </label>
              
              {destination ? (
                <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/20">
                      <MapPin className="size-6 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{destination.name || 'Custom Location'}</div>
                      <div className="text-sm text-slate-400">
                        {destination.lat.toFixed(4)}°, {destination.lon.toFixed(4)}°
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDestination(null)}
                    className="text-sm text-slate-400 transition-colors active:text-white"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowDestOptions(!showDestOptions)}
                    className="w-full rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Select destination...</span>
                      <MapPin className="size-5 text-slate-500" />
                    </div>
                  </button>

                  {showDestOptions && (
                    <div className="mt-3 space-y-2 rounded-xl bg-slate-900 p-3">
                      <div className="pt-2">
                        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                          Marinas
                        </div>
                        <div className="max-h-32 space-y-1 overflow-y-auto">
                          {marinas.map((marina) => (
                            <button
                              key={marina.id}
                              onClick={() => handleSelectMarina(marina, 'dest')}
                              className="flex w-full items-center gap-2 rounded-lg bg-slate-800 p-2 text-left transition-colors active:bg-slate-700"
                            >
                              <Ship className="size-4 text-blue-400" />
                              <span className="text-sm">{marina.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                          Anchorages
                        </div>
                        <div className="max-h-32 space-y-1 overflow-y-auto">
                          {anchorages.map((anchorage) => (
                            <button
                              key={anchorage.id}
                              onClick={() => handleSelectMarina(anchorage, 'dest')}
                              className="flex w-full items-center gap-2 rounded-lg bg-slate-800 p-2 text-left transition-colors active:bg-slate-700"
                            >
                              <Anchor className="size-4 text-green-400" />
                              <span className="text-sm">{anchorage.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Route Info - Only show when both points selected */}
            {startPoint && destination && (
              <div className="rounded-xl bg-slate-900 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-300">Route Information</div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Navigation2 className="size-4" />
                      <span className="text-sm">Distance</span>
                    </div>
                    <div className="text-lg font-bold text-cyan-400">{distance.toFixed(1)} nm</div>
                  </div>

                  <div className="h-px bg-slate-800"></div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Gauge className="size-4" />
                      <span className="text-sm">Boat Speed (knots)</span>
                    </div>
                    <input
                      type="number"
                      value={boatSpeed}
                      onChange={(e) => setBoatSpeed(e.target.value)}
                      min="1"
                      max="50"
                      step="0.5"
                      className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {boatSpeed && parseFloat(boatSpeed) > 0 && (
                    <>
                      <div className="h-px bg-slate-800"></div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="size-4" />
                          <span className="text-sm">Estimated Time</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {Math.floor(travelTime)}h {Math.round((travelTime % 1) * 60)}m
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-slate-800 p-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePreview}
              className="rounded-xl bg-slate-800 py-3 font-semibold text-white transition-colors active:bg-slate-700"
            >
              Preview Route
            </button>
            <button
              onClick={handleSave}
              className="rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
            >
              Save Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}