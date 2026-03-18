import { useState, useEffect } from 'react';
import { X, Calendar, Navigation, Clock, Cloud, FileText, Fuel, Gauge, MapPin } from 'lucide-react';
import { LogEntry, Route as RouteType } from '../data/mockData';

interface AddTripFormProps {
  onClose: () => void;
  onSave: (trip: Omit<LogEntry, 'id'>) => void;
}

export function AddTripForm({ onClose, onSave }: AddTripFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeName, setRouteName] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('Clear');
  const [windSpeed, setWindSpeed] = useState('');
  const [waveHeight, setWaveHeight] = useState('');
  const [seaCondition, setSeaCondition] = useState<'Calm' | 'Moderate' | 'Rough'>('Calm');
  const [fuelUsed, setFuelUsed] = useState('');
  const [avgSpeed, setAvgSpeed] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [notes, setNotes] = useState('');
  const [savedRoutes, setSavedRoutes] = useState<RouteType[]>([]);

  // Load saved routes from localStorage
  useEffect(() => {
    const routesStr = localStorage.getItem('savedRoutes');
    if (routesStr) {
      try {
        setSavedRoutes(JSON.parse(routesStr));
      } catch (e) {
        console.error('Failed to load routes:', e);
      }
    }
  }, []);

  // Auto-fill distance and duration when route is selected
  useEffect(() => {
    if (selectedRouteId) {
      const route = savedRoutes.find(r => r.id === selectedRouteId);
      if (route) {
        setRouteName(route.name);
        setDistance(route.distance.toString());
        setDuration(route.estimatedTime.toString());
      }
    }
  }, [selectedRouteId, savedRoutes]);

  const handleSubmit = () => {
    // Validation
    if (!routeName.trim()) {
      alert('Please enter a route name');
      return;
    }
    if (!duration || parseFloat(duration) <= 0) {
      alert('Please enter trip duration');
      return;
    }
    if (!distance || parseFloat(distance) <= 0) {
      alert('Please enter distance');
      return;
    }

    // Calculate average speed if not provided
    const calculatedAvgSpeed = avgSpeed 
      ? parseFloat(avgSpeed) 
      : parseFloat(distance) / parseFloat(duration);

    // Get route points if route was selected
    const selectedRoute = savedRoutes.find(r => r.id === selectedRouteId);

    const newTrip: Omit<LogEntry, 'id'> = {
      date,
      routeName,
      duration: parseFloat(duration),
      distance: parseFloat(distance),
      weatherCondition,
      notes,
      departureTime: departureTime || undefined,
      arrivalTime: arrivalTime || undefined,
      fuelUsed: fuelUsed ? parseFloat(fuelUsed) : undefined,
      avgSpeed: calculatedAvgSpeed,
      maxSpeed: maxSpeed ? parseFloat(maxSpeed) : undefined,
      routePoints: selectedRoute?.points,
      weather: windSpeed || waveHeight ? {
        wind: windSpeed ? parseFloat(windSpeed) : 0,
        waves: waveHeight ? parseFloat(waveHeight) : 0,
        pressure: 1013,
        temperature: 20,
        visibility: 10,
        seaCondition
      } : undefined,
    };

    onSave(newTrip);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Add New Trip</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors active:bg-slate-800"
          >
            <X className="size-6 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6 px-6 pb-32 pt-6">
        {/* Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <Calendar className="size-4" />
            Trip Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Route Selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <Navigation className="size-4" />
            Select Route (Optional)
          </label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Custom Trip (No Route)</option>
            {savedRoutes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name} - {route.distance} nm
              </option>
            ))}
          </select>
        </div>

        {/* Route Name */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <MapPin className="size-4" />
            Route Name
          </label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="e.g., Marina to Lighthouse"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Time Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Departure Time
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Arrival Time
            </label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Duration & Distance */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
              <Clock className="size-4" />
              Duration (hours)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="2.5"
              step="0.1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
              <Navigation className="size-4" />
              Distance (nm)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="15"
              step="0.1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Speed Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
              <Gauge className="size-4" />
              Avg Speed (kts)
            </label>
            <input
              type="number"
              value={avgSpeed}
              onChange={(e) => setAvgSpeed(e.target.value)}
              placeholder="Auto"
              step="0.1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Max Speed (kts)
            </label>
            <input
              type="number"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(e.target.value)}
              placeholder="8.5"
              step="0.1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Weather Condition */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <Cloud className="size-4" />
            Weather Condition
          </label>
          <select
            value={weatherCondition}
            onChange={(e) => setWeatherCondition(e.target.value)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option>Clear</option>
            <option>Partly Cloudy</option>
            <option>Cloudy</option>
            <option>Overcast</option>
            <option>Light Rain</option>
            <option>Rain</option>
            <option>Fog</option>
            <option>Stormy</option>
          </select>
        </div>

        {/* Sea Conditions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Wind Speed (kts)
            </label>
            <input
              type="number"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              placeholder="10"
              step="1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Wave Height (m)
            </label>
            <input
              type="number"
              value={waveHeight}
              onChange={(e) => setWaveHeight(e.target.value)}
              placeholder="0.5"
              step="0.1"
              min="0"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Sea Condition */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-400">
            Sea Condition
          </label>
          <select
            value={seaCondition}
            onChange={(e) => setSeaCondition(e.target.value as 'Calm' | 'Moderate' | 'Rough')}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option>Calm</option>
            <option>Moderate</option>
            <option>Rough</option>
          </select>
        </div>

        {/* Fuel Used */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <Fuel className="size-4" />
            Fuel Used (liters)
          </label>
          <input
            type="number"
            value={fuelUsed}
            onChange={(e) => setFuelUsed(e.target.value)}
            placeholder="Optional"
            step="0.1"
            min="0"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-400">
            <FileText className="size-4" />
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about the trip..."
            rows={4}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 p-6 backdrop-blur">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 py-3 font-semibold text-white transition-colors active:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
          >
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
}
