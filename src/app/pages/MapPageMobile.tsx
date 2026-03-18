import { useState, useEffect, useRef } from 'react';
import { MapPin, Anchor, Fuel, AlertTriangle, Ship, Plus, Filter, Route, Navigation2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { mapPoints as initialMapPoints, MapPoint, savedRoutes as initialSavedRoutes, Route as RouteType } from '../data/mockData';
import { MarineMap } from '../components/MarineMap';
import { AddPointForm } from '../components/AddPointForm';
import { PointDetailsSheet } from '../components/PointDetailsSheet';
import { NavigationPanel } from '../components/NavigationPanel';
import { RouteBuilder } from '../components/RouteBuilder';

export function MapPageMobile() {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.4825, 30.7233]); // Odessa, Black Sea
  const [mapZoom, setMapZoom] = useState(12);
  const [activeFilters, setActiveFilters] = useState({
    marina: true,
    port: true,
    anchorage: true,
    fuel: true,
    danger: true,
    custom: true,
  });
  
  // New point adding state
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [selectedPointType, setSelectedPointType] = useState<MapPoint['type']>('custom');
  const [newPointCoordinates, setNewPointCoordinates] = useState<[number, number] | null>(null);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(() => {
    const saved = localStorage.getItem('mapPoints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load map points:', e);
      }
    }
    // Return default map points for demo
    return initialMapPoints;
  });

  // Navigation state
  const [navigationDestination, setNavigationDestination] = useState<MapPoint | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number]>([46.4825, 30.7233]);

  // Saved points state (from localStorage)
  const [savedPointIds, setSavedPointIds] = useState<Set<string>>(new Set());

  // Route builder state
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);

  // Active route state
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  
  // Track if route has been centered to prevent re-centering
  const routeCenteredRef = useRef(false);
  
  // Load saved routes from localStorage
  const [savedRoutes, setSavedRoutes] = useState<RouteType[]>(() => {
    const saved = localStorage.getItem('savedRoutes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load routes:', e);
      }
    }
    // Return default saved routes for demo
    return initialSavedRoutes;
  });

  // Save map points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mapPoints', JSON.stringify(mapPoints));
  }, [mapPoints]);

  // Load saved points from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPoints');
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        setSavedPointIds(new Set(ids));
      } catch (e) {
        console.error('Failed to load saved points:', e);
      }
    }
  }, []);

  // Load active route from localStorage on mount
  useEffect(() => {
    const activeRoute = localStorage.getItem('activeRoute');
    if (activeRoute && !routeCenteredRef.current) {
      // Reload savedRoutes in case it was just created
      const savedRoutesStr = localStorage.getItem('savedRoutes');
      if (savedRoutesStr) {
        try {
          setSavedRoutes(JSON.parse(savedRoutesStr));
        } catch (e) {
          console.error('Failed to load routes:', e);
        }
      }
      
      setActiveRouteId(activeRoute);
      
      // Find the route and center map on it
      const route = savedRoutes.find(r => r.id === activeRoute);
      if (route && route.points.length > 0) {
        const firstPoint = mapPoints.find(p => p.id === route.points[0]);
        if (firstPoint) {
          setMapCenter([firstPoint.lat, firstPoint.lng]);
          setMapZoom(13);
          routeCenteredRef.current = true;
        }
      }
      
      // Clear the activeRoute from localStorage after loading it
      localStorage.removeItem('activeRoute');
    }
  }, []);
  
  // Reload routes when RouteBuilder closes
  useEffect(() => {
    if (!showRouteBuilder) {
      const savedRoutesStr = localStorage.getItem('savedRoutes');
      if (savedRoutesStr) {
        try {
          setSavedRoutes(JSON.parse(savedRoutesStr));
        } catch (e) {
          console.error('Failed to load routes:', e);
        }
      }
    }
  }, [showRouteBuilder]);

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

  const filteredPoints = mapPoints.filter(
    point => activeFilters[point.type as keyof typeof activeFilters] !== false
  );

  const centerOnLocation = () => {
    // TODO: Get user's actual GPS location
    // navigator.geolocation.getCurrentPosition((position) => {
    //   setMapCenter([position.coords.latitude, position.coords.longitude]);
    // });
    
    // For now, center on first marina
    if (filteredPoints.length > 0) {
      setMapCenter([filteredPoints[0].lat, filteredPoints[0].lng]);
    }
  };

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
  };

  const handleAddPointTypeSelect = (type: MapPoint['type']) => {
    setSelectedPointType(type);
    setIsAddingPoint(true);
    setShowAddMenu(false);
  };

  const handleMapClick = (coordinates: [number, number]) => {
    console.log('Map clicked! Coordinates:', coordinates);
    console.log('isAddingPoint:', isAddingPoint);
    setNewPointCoordinates(coordinates);
  };

  const handleSavePoint = (point: Omit<MapPoint, 'id'>) => {
    // Generate a simple ID
    const newId = String(mapPoints.length + 1);
    const newPoint: MapPoint = {
      ...point,
      id: newId,
    };
    
    setMapPoints([...mapPoints, newPoint]);
    setIsAddingPoint(false);
    setNewPointCoordinates(null);
  };

  const handleCancelAddPoint = () => {
    setIsAddingPoint(false);
    setNewPointCoordinates(null);
  };

  const handleSavePointToLocalStorage = (point: MapPoint) => {
    const newSet = new Set(savedPointIds);
    newSet.add(point.id);
    setSavedPointIds(newSet);
    localStorage.setItem('savedPoints', JSON.stringify(Array.from(newSet)));
  };

  const handleRemovePointFromLocalStorage = (point: MapPoint) => {
    const newSet = new Set(savedPointIds);
    newSet.delete(point.id);
    setSavedPointIds(newSet);
    localStorage.setItem('savedPoints', JSON.stringify(Array.from(newSet)));
  };

  const handleNavigateToPoint = (point: MapPoint) => {
    setNavigationDestination(point);
    setSelectedPoint(null); // Close the details sheet
  };

  // Get active route points
  const activeRoute = activeRouteId ? savedRoutes.find(r => r.id === activeRouteId) : null;
  const activeRoutePoints = activeRoute 
    ? activeRoute.points
        .map(pointId => mapPoints.find(p => p.id === pointId))
        .filter((p): p is MapPoint => p !== undefined)
        .map(p => [p.lat, p.lng] as [number, number])
    : null;

  return (
    <div className="relative h-screen bg-slate-950 text-white">
      {/* OpenStreetMap - Full Screen */}
      <div className="absolute inset-0 z-0 pt-0">
        <MarineMap 
          points={filteredPoints} 
          center={mapCenter}
          zoom={mapZoom}
          onPointClick={handlePointClick}
          onCenterChange={setMapCenter}
          onZoomChange={setMapZoom}
          isAddingPoint={isAddingPoint}
          onMapClick={handleMapClick}
          navigationRoute={navigationDestination ? {
            start: userLocation,
            end: [navigationDestination.lat, navigationDestination.lng]
          } : null}
          userLocation={userLocation}
          routePoints={activeRoutePoints}
        />
      </div>

      {/* Floating Action Buttons - Right Side */}
      {!isAddingPoint && (
        <div className="absolute right-4 top-[72px] z-10 space-y-2">
          {/* Add Point - Primary Action */}
          <div className="relative">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex size-12 items-center justify-center rounded-full bg-cyan-500 shadow-lg transition-transform active:scale-95"
            >
              <Plus className={`size-6 text-white transition-transform ${showAddMenu ? 'rotate-45' : ''}`} />
            </button>

            {/* Add Point Menu */}
            {showAddMenu && (
              <div className="absolute right-14 top-0 w-44 space-y-1.5 rounded-2xl bg-slate-900 p-2.5 shadow-xl">
                <button 
                  onClick={() => handleAddPointTypeSelect('marina')}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800 p-2.5 text-left transition-colors active:bg-slate-700"
                >
                  <Ship className="size-4 text-blue-400" />
                  <span className="text-sm font-medium">Add Marina</span>
                </button>
                <button 
                  onClick={() => handleAddPointTypeSelect('anchorage')}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800 p-2.5 text-left transition-colors active:bg-slate-700"
                >
                  <Anchor className="size-4 text-green-400" />
                  <span className="text-sm font-medium">Add Anchorage</span>
                </button>
                <button 
                  onClick={() => handleAddPointTypeSelect('fuel')}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800 p-2.5 text-left transition-colors active:bg-slate-700"
                >
                  <Fuel className="size-4 text-orange-400" />
                  <span className="text-sm font-medium">Add Fuel Station</span>
                </button>
                <button 
                  onClick={() => handleAddPointTypeSelect('danger')}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800 p-2.5 text-left transition-colors active:bg-slate-700"
                >
                  <AlertTriangle className="size-4 text-red-400" />
                  <span className="text-sm font-medium">Add Danger Zone</span>
                </button>
                <button 
                  onClick={() => handleAddPointTypeSelect('custom')}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-slate-800 p-2.5 text-left transition-colors active:bg-slate-700"
                >
                  <MapPin className="size-4 text-slate-400" />
                  <span className="text-sm font-medium">Add Custom Point</span>
                </button>
              </div>
            )}
          </div>

          {/* Routes */}
          <button 
            onClick={() => setShowRouteBuilder(!showRouteBuilder)}
            className="flex size-12 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
          >
            <Route className="size-5 text-white" />
          </button>

          {/* Filters */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex size-12 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
          >
            <Filter className="size-5 text-white" />
          </button>

          {/* My Location */}
          <button 
            onClick={centerOnLocation}
            className="flex size-12 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
          >
            <Navigation2 className="size-5 text-cyan-400" />
          </button>

          {/* Zoom In */}
          <button 
            onClick={() => setMapZoom(mapZoom + 1)}
            className="flex size-12 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
          >
            <ZoomIn className="size-5 text-white" />
          </button>

          {/* Zoom Out */}
          <button 
            onClick={() => setMapZoom(mapZoom - 1)}
            className="flex size-12 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
          >
            <ZoomOut className="size-5 text-white" />
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/50" onClick={() => setShowFilters(false)}>
          <div 
            className="w-full rounded-t-3xl bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Filter Points</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="size-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Ship className="size-5 text-blue-400" />
                  <span>Marinas</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.marina}
                  onChange={(e) => setActiveFilters({...activeFilters, marina: e.target.checked})}
                  className="size-5"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Ship className="size-5 text-indigo-400" />
                  <span>Ports</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.port}
                  onChange={(e) => setActiveFilters({...activeFilters, port: e.target.checked})}
                  className="size-5"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Anchor className="size-5 text-green-400" />
                  <span>Anchorages</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.anchorage}
                  onChange={(e) => setActiveFilters({...activeFilters, anchorage: e.target.checked})}
                  className="size-5"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Fuel className="size-5 text-orange-400" />
                  <span>Fuel Stations</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.fuel}
                  onChange={(e) => setActiveFilters({...activeFilters, fuel: e.target.checked})}
                  className="size-5"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-red-400" />
                  <span>Danger Zones</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.danger}
                  onChange={(e) => setActiveFilters({...activeFilters, danger: e.target.checked})}
                  className="size-5"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-slate-400" />
                  <span>Custom Points</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={activeFilters.custom}
                  onChange={(e) => setActiveFilters({...activeFilters, custom: e.target.checked})}
                  className="size-5"
                />
              </label>
            </div>

            <button 
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet for Selected Point */}
      {selectedPoint && (
        <PointDetailsSheet
          point={selectedPoint}
          userLocation={userLocation}
          onClose={() => setSelectedPoint(null)}
          onSave={handleSavePointToLocalStorage}
          onNavigate={handleNavigateToPoint}
          isSaved={savedPointIds.has(selectedPoint.id)}
        />
      )}

      {/* Add Point Form */}
      {isAddingPoint && (
        <>
          {/* Instruction overlay when waiting for map click */}
          {!newPointCoordinates && (
            <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
              <div className="pointer-events-none rounded-2xl bg-cyan-500 px-6 py-4 shadow-xl">
                <div className="pointer-events-none flex items-center gap-3">
                  <MapPin className="size-6 text-white" />
                  <div className="text-lg font-semibold text-white">Tap on map to place point</div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel button in top-left when adding point */}
          {!newPointCoordinates && (
            <div className="absolute left-4 top-[72px] z-40">
              <button
                onClick={handleCancelAddPoint}
                className="flex size-14 items-center justify-center rounded-full bg-slate-900 shadow-lg transition-transform active:scale-95"
              >
                <X className="size-6 text-white" />
              </button>
            </div>
          )}

          {/* Form appears after coordinates are selected */}
          {newPointCoordinates && (
            <AddPointForm
              pointType={selectedPointType}
              coordinates={newPointCoordinates}
              onSave={handleSavePoint}
              onCancel={handleCancelAddPoint}
            />
          )}
        </>
      )}

      {/* Navigation Panel */}
      {navigationDestination && (
        <NavigationPanel
          destination={navigationDestination}
          userLocation={userLocation}
          onClose={() => setNavigationDestination(null)}
        />
      )}

      {/* Route Builder */}
      {showRouteBuilder && (
        <RouteBuilder
          points={mapPoints}
          onClose={() => setShowRouteBuilder(false)}
        />
      )}
    </div>
  );
}