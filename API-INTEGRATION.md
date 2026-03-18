# API Integration Guide

This marine navigation app is designed to seamlessly integrate with real weather and mapping APIs. All mock data can be replaced with live API calls.

## Weather APIs

### Option 1: Stormglass Marine Weather API (Recommended for Marine)
**Best for**: Comprehensive marine weather data including waves, tides, currents

```typescript
// src/app/services/weatherApi.ts

const STORMGLASS_API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;

export const getMarineWeather = async (lat: number, lng: number): Promise<MarineWeatherForecast> => {
  const response = await fetch(
    `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=windSpeed,windDirection,gust,waveHeight,wavePeriod,waveDirection,airTemperature,waterTemperature,pressure,visibility,cloudCover,precipitation`,
    {
      headers: {
        'Authorization': STORMGLASS_API_KEY
      }
    }
  );
  
  const data = await response.json();
  
  return {
    current: transformStormglassData(data.hours[0]),
    hourly: data.hours.slice(0, 24).map(transformStormglassData),
    daily: aggregateDailyData(data.hours)
  };
};

function transformStormglassData(hour: any): WeatherData {
  return {
    timestamp: hour.time,
    lat: 0, // from request
    lng: 0, // from request
    windSpeed: hour.windSpeed?.noaa || 0,
    windDirection: hour.windDirection?.noaa || 0,
    windGusts: hour.gust?.noaa || 0,
    waveHeight: hour.waveHeight?.noaa || 0,
    wavePeriod: hour.wavePeriod?.noaa || 0,
    waveDirection: hour.waveDirection?.noaa || 0,
    pressure: hour.pressure?.noaa || 1013,
    airTemp: hour.airTemperature?.noaa || 15,
    waterTemp: hour.waterTemperature?.noaa || 15,
    visibility: hour.visibility?.noaa || 10,
    humidity: 0, // not available in Stormglass
    condition: determineCondition(hour),
    cloudCover: hour.cloudCover?.noaa || 0,
    precipitation: hour.precipitation?.noaa || 0
  };
}
```

**Pricing**: https://stormglass.io/pricing
- Free: 50 requests/day
- Starter: $29/month (10,000 requests)

---

### Option 2: OpenWeatherMap API
**Best for**: General weather data, good free tier

```typescript
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getMarineWeather = async (lat: number, lng: number): Promise<MarineWeatherForecast> => {
  // Current weather
  const currentResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );
  
  // Forecast
  const forecastResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );
  
  const current = await currentResponse.json();
  const forecast = await forecastResponse.json();
  
  return {
    current: transformOpenWeatherData(current),
    hourly: forecast.list.slice(0, 24).map(transformOpenWeatherData),
    daily: aggregateDailyData(forecast.list)
  };
};

function transformOpenWeatherData(data: any): WeatherData {
  return {
    timestamp: new Date(data.dt * 1000).toISOString(),
    lat: data.coord?.lat || 0,
    lng: data.coord?.lon || 0,
    windSpeed: (data.wind?.speed || 0) * 1.94384, // m/s to knots
    windDirection: data.wind?.deg || 0,
    windGusts: (data.wind?.gust || 0) * 1.94384,
    waveHeight: 0, // not available in free tier
    wavePeriod: 0,
    waveDirection: 0,
    pressure: data.main?.pressure || 1013,
    airTemp: data.main?.temp || 15,
    waterTemp: data.main?.temp || 15, // approximation
    visibility: (data.visibility || 10000) / 1000, // meters to km
    humidity: data.main?.humidity || 0,
    condition: data.weather?.[0]?.main || 'Unknown',
    cloudCover: data.clouds?.all || 0,
    precipitation: data.rain?.['1h'] || 0
  };
}
```

**Pricing**: https://openweathermap.org/price
- Free: 1,000 calls/day
- Startup: $40/month (100,000 calls)

---

## Map Data

### Current Setup: OpenStreetMap
The app uses a simplified map visualization inspired by OpenStreetMap design.

**For production deployment with full interactive maps**, you can integrate:
- **Leaflet + React-Leaflet**: Full-featured mapping library
- **Mapbox GL JS**: Advanced vector maps with 3D capabilities
- **Google Maps API**: Comprehensive mapping solution

### Integrating Leaflet (Full Version)

```bash
npm install leaflet react-leaflet
```

```typescript
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

<MapContainer center={[43.7384, 28.6342]} zoom={12}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap'
  />
  {/* Add your markers */}
</MapContainer>
```

### Optional: OpenSeaMap Overlay
Add marine navigation charts overlay:

```typescript
// In MarineMap.tsx
<TileLayer
  url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
  attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a>'
/>
```

### Optional: Marine POI from APIs
Integrate marina/port databases:

- **Marinas.com API**: Commercial marina data
- **ActiveCaptain**: Community-driven cruising data
- **Custom backend**: Your own POI database

---

## Environment Variables

Create `.env.local` file:

```bash
# Weather APIs
VITE_STORMGLASS_API_KEY=your_stormglass_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here

# Optional: Custom backend
VITE_API_BASE_URL=https://your-backend.com/api
```

---

## Migration Checklist

### Step 1: Choose Weather API
- [ ] Sign up for Stormglass or OpenWeatherMap
- [ ] Get API key
- [ ] Add to `.env.local`

### Step 2: Update Weather Service
- [ ] Replace mock data in `/src/app/services/weatherApi.ts`
- [ ] Implement API transformation functions
- [ ] Add error handling
- [ ] Test with real coordinates

### Step 3: Update Components
- [ ] No changes needed! Components use the same interface
- [ ] Weather data automatically populates from API

### Step 4: Add Caching (Optional)
```typescript
// Simple in-memory cache
const weatherCache = new Map();

export const getMarineWeather = async (lat: number, lng: number) => {
  const key = `${lat},${lng}`;
  const cached = weatherCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return cached.data; // Use cached data if less than 10 minutes old
  }
  
  const data = await fetchFromAPI(lat, lng);
  weatherCache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

---

## Rate Limiting Best Practices

1. **Cache aggressively**: Weather doesn't change every second
2. **Debounce requests**: Don't fetch on every map move
3. **Batch requests**: Combine multiple data points
4. **Use WebSockets**: For real-time updates (if API supports)

---

## Data Structure Compatibility

All components are designed to work with the `WeatherData` and `MapPoint` interfaces defined in `/src/app/services/weatherApi.ts` and `/src/app/data/mockData.ts`.

No component changes needed when switching from mock to real data!

---

## Testing

```typescript
// Test API integration
import { getMarineWeather } from './services/weatherApi';

const testWeatherAPI = async () => {
  try {
    const weather = await getMarineWeather(43.7384, 28.6342);
    console.log('✅ Weather API working:', weather);
  } catch (error) {
    console.error('❌ Weather API failed:', error);
  }
};
```

---

## Support

- Stormglass Docs: https://docs.stormglass.io
- OpenWeatherMap Docs: https://openweathermap.org/api
- Leaflet Docs: https://leafletjs.com/reference.html
- React Leaflet: https://react-leaflet.js.org/