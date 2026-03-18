import { useState, useEffect } from 'react';
import { 
  Wind, 
  Waves, 
  Eye, 
  Gauge,
  Thermometer,
  Navigation as NavIcon,
  AlertTriangle,
  MapPin,
  Loader2,
  Edit3,
  Globe,
  Compass,
  X
} from 'lucide-react';

interface OpenMeteoData {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    pressure_msl: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    visibility: number[];
    pressure_msl: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export function WeatherPageMobile() {
  const [weatherData, setWeatherData] = useState<OpenMeteoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [showChangeLocation, setShowChangeLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState({ lat: '', lon: '' });

  useEffect(() => {
    // Get user's geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          try {
            // Fetch weather data from Open-Meteo API
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,visibility,pressure_msl&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
            
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch weather data');
            setLoading(false);
          }
        },
        async (err) => {
          console.log('Geolocation not available, using default location (Sochi, Russia)');
          // If geolocation fails, automatically use default location
          try {
            const defaultLat = 43.5855;
            const defaultLon = 39.7231;
            setLocation({ lat: defaultLat, lon: defaultLon });
            
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${defaultLat}&longitude=${defaultLon}&current=temperature_2m,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,visibility,pressure_msl&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
            
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            setLoading(false);
          } catch (fetchErr) {
            setError('Failed to fetch weather data');
            setLoading(false);
          }
        }
      );
    } else {
      // Geolocation not supported, use default location
      const defaultLat = 43.5855;
      const defaultLon = 39.7231;
      fetchWeatherData(defaultLat, defaultLon);
    }
  }, []);

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const kmToNauticalMiles = (km: number): number => {
    return Math.round(km * 0.539957);
  };

  const msToKnots = (ms: number): number => {
    return Math.round(ms * 1.94384);
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,visibility,pressure_msl&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
      
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
      setLocation({ lat, lon });
      setLoading(false);
      setShowLocationOptions(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  };

  const handleAllowLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          setError('Unable to get your location. Please check permissions.');
        }
      );
    }
  };

  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLocation.lat);
    const lon = parseFloat(manualLocation.lon);
    
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180');
      return;
    }
    
    fetchWeatherData(lat, lon);
  };

  const handleUseDefaultLocation = () => {
    // Default location: Odessa, Ukraine (Black Sea)
    fetchWeatherData(46.4825, 30.7233);
  };

  // Loading state
  if (loading && !showLocationOptions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-cyan-400" />
          <p className="text-slate-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Error state - Show location options
  if ((error || !weatherData) && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="space-y-6 px-6 pb-6 pt-16">
          <h1 className="text-xl font-semibold text-white">Weather</h1>

          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertTriangle className="size-12 text-orange-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Unable to get location</h2>
              <p className="mt-2 text-sm text-slate-400">
                {error || 'Please choose a location option below'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (!navigator.geolocation) {
                  setError('Geolocation is not supported by your browser.');
                  return;
                }
                
                setError('Getting your location...');
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                  },
                  (err) => {
                    switch(err.code) {
                      case 1: // PERMISSION_DENIED
                        if (err.message && err.message.includes('permissions policy')) {
                          setError('Geolocation is disabled by browser security policy. Please use manual coordinates or default location.');
                        } else {
                          setError('Location access denied. Please enable location permissions in your browser settings.');
                        }
                        break;
                      case 2: // POSITION_UNAVAILABLE
                        setError('Location information unavailable. Please try manual entry.');
                        break;
                      case 3: // TIMEOUT
                        setError('Location request timed out. Please try again or use manual entry.');
                        break;
                      default:
                        setError('Unable to get your location. Please try manual entry.');
                    }
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                  }
                );
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <MapPin className="size-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Use Current Location</div>
                <div className="text-sm text-slate-400">Get my GPS coordinates</div>
              </div>
            </button>

            <button
              onClick={() => setShowLocationOptions(true)}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Edit3 className="size-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Enter Coordinates</div>
                <div className="text-sm text-slate-400">Input latitude and longitude manually</div>
              </div>
            </button>

            {showLocationOptions && (
              <div className="rounded-xl bg-slate-800 p-4">
                <h3 className="mb-3 font-medium text-white">Enter Coordinates</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Latitude (e.g., 46.4825)"
                    value={manualLocation.lat}
                    onChange={(e) => setManualLocation({ ...manualLocation, lat: e.target.value })}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Longitude (e.g., 30.7233)"
                    value={manualLocation.lon}
                    onChange={(e) => setManualLocation({ ...manualLocation, lon: e.target.value })}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleManualLocationSubmit}
                    className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
                  >
                    Get Weather
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleUseDefaultLocation}
              className="flex w-full items-center gap-3 rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/20">
                <Globe className="size-5 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Use Default Location</div>
                <div className="text-sm text-slate-400">Odessa, Black Sea (46.48°, 30.72°)</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - this should never happen but TypeScript needs it
  if (!weatherData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-cyan-400" />
          <p className="text-slate-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  const { current, hourly, daily } = weatherData;
  
  // Get current hour index
  const currentHourIndex = new Date().getHours();
  
  // Get next 24 hours of data
  const next24Hours = Array.from({ length: 24 }, (_, i) => {
    const index = currentHourIndex + i;
    return {
      time: hourly.time[index],
      temp: hourly.temperature_2m[index],
      wind: hourly.wind_speed_10m[index],
      windDir: hourly.wind_direction_10m[index],
      visibility: hourly.visibility[index],
      pressure: hourly.pressure_msl[index],
    };
  });

  // Current visibility in km
  const currentVisibility = hourly.visibility[currentHourIndex] / 1000;
  
  // Check for strong wind warning
  const windSpeedKnots = msToKnots(current.wind_speed_10m);
  const isStrongWind = windSpeedKnots > 20;

  // Get max values for chart scaling
  const maxWindSpeed = Math.max(...next24Hours.slice(0, 7).map(h => h.wind));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="space-y-6 px-6 pb-6 pt-[56px]">
        {/* Title with location */}
        <div>
          <h1 className="text-xl font-semibold text-white">Weather</h1>
          {location && (
            <button
              onClick={() => setShowChangeLocation(true)}
              className="mt-1 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-400 transition-colors active:bg-slate-800"
            >
              <MapPin className="size-4" />
              <span>{location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°</span>
              <Compass className="size-4 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Warning if needed */}
        {isStrongWind && (
          <div className="flex items-center gap-3 rounded-xl border border-orange-500 bg-orange-500/10 p-4">
            <AlertTriangle className="size-6 text-orange-500" />
            <div>
              <div className="font-semibold text-orange-500">Strong Wind Warning</div>
              <div className="text-sm text-orange-400">Exercise caution at sea</div>
            </div>
          </div>
        )}

        {/* Current Conditions */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">Current Conditions</h2>
          
          <div className="space-y-3">
            {/* Temperature */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-4">
              <div className="rounded-lg bg-red-500/20 p-2">
                <Thermometer className="size-5 text-red-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Temperature</div>
                <div className="text-2xl font-semibold">{Math.round(current.temperature_2m)}°C</div>
              </div>
            </div>

            {/* Wind */}
            <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Wind className="size-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Wind Speed</div>
                  <div className="font-semibold">
                    {windSpeedKnots} kts {getWindDirection(current.wind_direction_10m)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Direction</div>
                <div className="font-semibold">{Math.round(current.wind_direction_10m)}°</div>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-4">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Eye className="size-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Visibility</div>
                <div className="font-semibold">{currentVisibility.toFixed(1)} km</div>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-4">
              <div className="rounded-lg bg-orange-500/20 p-2">
                <Gauge className="size-5 text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-slate-400">Pressure (MSL)</div>
                <div className="font-semibold">{Math.round(current.pressure_msl)} hPa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wind Direction Compass */}
        <div className="rounded-xl bg-slate-900 p-6">
          <div className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">Wind Direction</div>
          <div className="relative mx-auto size-40">
            {/* Compass circle */}
            <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
            
            {/* Cardinal directions */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 text-sm font-bold text-slate-400">N</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">E</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-400">S</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">W</div>
            
            {/* Wind arrow */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(-50%, -50%) rotate(${current.wind_direction_10m}deg)` }}
            >
              {/* Custom Wind Arrow SVG */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>

        {/* Hourly Forecast - Wind Speed */}
        <div className="rounded-xl bg-slate-900 p-6">
          <div className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">Hourly Wind Forecast</div>
          <div className="space-y-3">
            {next24Hours.slice(0, 12).map((hour, index) => {
              const hourTime = new Date(hour.time);
              const barHeight = (hour.wind / maxWindSpeed) * 100;
              const windKnots = msToKnots(hour.wind);
              
              return (
                <div key={hour.time} className="flex items-center gap-3">
                  <div className="w-12 text-xs text-slate-400">
                    {hourTime.getHours()}:00
                  </div>
                  <div className="flex-1">
                    <div className="relative h-8 rounded-full bg-slate-800">
                      <div 
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${barHeight}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-semibold">
                    {windKnots} kts
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">7-Day Forecast</h2>
          <div className="space-y-2">
            {daily.time.slice(0, 7).map((date, index) => {
              const dayDate = new Date(date);
              const maxTemp = Math.round(daily.temperature_2m_max[index]);
              const minTemp = Math.round(daily.temperature_2m_min[index]);
              const maxWind = msToKnots(daily.wind_speed_10m_max[index]);
              const windDir = getWindDirection(daily.wind_direction_10m_dominant[index]);
              
              return (
                <div key={date} className="flex items-center justify-between rounded-xl bg-slate-900 p-4">
                  <div className="flex-1">
                    <div className="font-medium">
                      {dayDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-sm text-slate-400">{windDir}</div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-xs text-slate-400">Wind</div>
                      <div className="font-semibold">{maxWind} kts</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">High</div>
                      <div className="font-semibold">{maxTemp}°</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Low</div>
                      <div className="font-semibold">{minTemp}°</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Change Location Modal */}
      {showChangeLocation && (
        <div className="fixed inset-0 z-50 bg-slate-950">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 pt-16">
              <h2 className="text-xl font-semibold text-white">Change Location</h2>
              <button
                onClick={() => setShowChangeLocation(false)}
                className="flex size-10 items-center justify-center rounded-full bg-slate-800 transition-colors active:bg-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setError('Geolocation is not supported by your browser.');
                      return;
                    }
                    
                    setError('Getting your location...');
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        fetchWeatherData(position.coords.latitude, position.coords.longitude);
                        setShowChangeLocation(false);
                      },
                      (err) => {
                        switch(err.code) {
                          case 1: // PERMISSION_DENIED
                            if (err.message && err.message.includes('permissions policy')) {
                              setError('Geolocation is disabled by browser security policy. Please use manual coordinates or default location.');
                            } else {
                              setError('Location access denied. Please enable location permissions in your browser settings.');
                            }
                            break;
                          case 2: // POSITION_UNAVAILABLE
                            setError('Location information unavailable. Please try manual entry.');
                            break;
                          case 3: // TIMEOUT
                            setError('Location request timed out. Please try again or use manual entry.');
                            break;
                          default:
                            setError('Unable to get your location. Please try manual entry.');
                        }
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                      }
                    );
                  }}
                  className="flex w-full items-center gap-4 rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-500/20">
                    <MapPin className="size-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">Use Current Location</div>
                    <div className="text-sm text-slate-400">Get my GPS coordinates</div>
                  </div>
                </button>

                <div className="rounded-xl bg-slate-900 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/20">
                      <Edit3 className="size-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold">Enter Coordinates</div>
                      <div className="text-sm text-slate-400">Input latitude and longitude manually</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-2 block text-sm text-slate-400">Latitude</label>
                      <input
                        type="text"
                        placeholder="46.4825"
                        value={manualLocation.lat}
                        onChange={(e) => setManualLocation({ ...manualLocation, lat: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-400">Longitude</label>
                      <input
                        type="text"
                        placeholder="30.7233"
                        value={manualLocation.lon}
                        onChange={(e) => setManualLocation({ ...manualLocation, lon: e.target.value })}
                        className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleManualLocationSubmit();
                        setShowChangeLocation(false);
                      }}
                      className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
                    >
                      Load Weather
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}