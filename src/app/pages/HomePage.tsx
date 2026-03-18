import { Link } from 'react-router';
import { 
  Wind, 
  Waves, 
  Eye, 
  Gauge,
  Thermometer,
  Navigation as NavIcon,
  MapPin,
  Route,
  BookOpen,
  Plus,
  User
} from 'lucide-react';
import { weatherForecast } from '../data/mockData';

export function HomePage() {
  const current = weatherForecast[0];
  
  // Calculate sea status
  const getSeaStatus = () => {
    if (current.windSpeed > 20 || current.waveHeight > 2) {
      return { label: 'DANGEROUS', color: 'bg-red-500', textColor: 'text-red-500' };
    }
    if (current.windSpeed > 15 || current.waveHeight > 1.5) {
      return { label: 'MODERATE', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    }
    return { label: 'GOOD', color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const seaStatus = getSeaStatus();

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="space-y-6 px-6 pb-6 pt-16">
        {/* Header with Title and Profile */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Home</h1>
          <Link 
            to="/vessel"
            className="flex size-10 items-center justify-center rounded-full bg-slate-800 transition-colors active:bg-slate-700"
          >
            <User className="size-5" />
          </Link>
        </div>

        {/* Sea Status */}
        <div className={`rounded-2xl ${seaStatus.color} p-6 text-center`}>
          <div className="text-sm font-medium uppercase tracking-wider opacity-90">Sea Status</div>
          <div className="mt-2 text-3xl font-bold">{seaStatus.label}</div>
        </div>

        {/* Current Conditions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Current Conditions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Wind */}
            <div className="rounded-xl bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Wind className="size-4" />
                <span className="text-sm">Wind</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{current.windSpeed}</div>
              <div className="text-sm text-slate-400">knots {getWindDirection(current.windDirection)}</div>
            </div>

            {/* Waves */}
            <div className="rounded-xl bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Waves className="size-4" />
                <span className="text-sm">Waves</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{current.waveHeight}</div>
              <div className="text-sm text-slate-400">meters</div>
            </div>

            {/* Visibility */}
            <div className="rounded-xl bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Eye className="size-4" />
                <span className="text-sm">Visibility</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{current.visibility}</div>
              <div className="text-sm text-slate-400">km</div>
            </div>

            {/* Pressure */}
            <div className="rounded-xl bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Gauge className="size-4" />
                <span className="text-sm">Pressure</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{current.pressure}</div>
              <div className="text-sm text-slate-400">hPa</div>
            </div>
          </div>
        </div>

        {/* Wind Compass */}
        <div className="rounded-xl bg-slate-900 p-6">
          <div className="text-center">
            <div className="mb-4 text-sm font-medium text-slate-400">Wind Direction</div>
            <div className="relative mx-auto size-32">
              {/* Compass circle */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
              
              {/* Cardinal directions */}
              <div className="absolute left-1/2 top-1 -translate-x-1/2 text-xs font-bold text-slate-400">N</div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">E</div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">S</div>
              <div className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">W</div>
              
              {/* Wind arrow */}
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${current.windDirection}deg)` }}
              >
                {/* Custom Wind Arrow SVG */}
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M20 5 L24 18 L20 15 L16 18 Z" 
                    fill="#22D3EE" 
                    stroke="#22D3EE" 
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="20" r="2" fill="#22D3EE" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-lg font-semibold">{getWindDirection(current.windDirection)} • {current.windSpeed} knots</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Thermometer className="size-4" />
              <span className="text-sm">Air Temp</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{current.airTemp}°C</div>
          </div>

          <div className="rounded-xl bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Waves className="size-4" />
              <span className="text-sm">Water Temp</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{current.waterTemp}°C</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/routes"
              className="flex flex-col items-center gap-3 rounded-xl bg-blue-600 p-4 transition-colors active:bg-blue-700"
            >
              <Route className="size-6" />
              <span className="text-sm font-medium">Plan Route</span>
            </Link>

            <Link 
              to="/map"
              className="flex flex-col items-center gap-3 rounded-xl bg-blue-600 p-4 transition-colors active:bg-blue-700"
            >
              <MapPin className="size-6" />
              <span className="text-sm font-medium">Open Map</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}