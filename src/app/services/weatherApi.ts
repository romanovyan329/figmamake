/**
 * Weather API Service
 * 
 * This service provides weather data for marine navigation.
 * Currently uses mock data, but is structured to easily integrate with:
 * - OpenWeatherMap API (https://openweathermap.org/api)
 * - Stormglass Marine Weather API (https://stormglass.io/)
 */

export interface WeatherData {
  timestamp: string;
  lat: number;
  lng: number;
  // Wind data
  windSpeed: number; // knots
  windDirection: number; // degrees (0-360)
  windGusts: number; // knots
  // Wave data
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  waveDirection: number; // degrees
  // Atmospheric data
  pressure: number; // hPa
  airTemp: number; // Celsius
  waterTemp: number; // Celsius
  visibility: number; // km
  humidity: number; // percentage
  // Conditions
  condition: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough';
  cloudCover: number; // percentage
  precipitation: number; // mm
}

export interface MarineWeatherForecast {
  current: WeatherData;
  hourly: WeatherData[];
  daily: WeatherData[];
}

/**
 * Mock data generator - simulates API response
 * Replace this with real API call:
 * 
 * Example OpenWeatherMap:
 * const response = await fetch(
 *   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
 * );
 * 
 * Example Stormglass:
 * const response = await fetch(
 *   `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}`,
 *   { headers: { 'Authorization': API_KEY } }
 * );
 */
const generateMockWeatherData = (daysOffset: number = 0): WeatherData => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + daysOffset);
  
  // Simulate realistic marine weather patterns
  const baseWind = 10 + Math.random() * 15;
  const waveHeight = 0.5 + (baseWind / 15) * 2;
  
  return {
    timestamp: baseDate.toISOString(),
    lat: 43.7384, // Example: Black Sea coordinates
    lng: 28.6342,
    windSpeed: Math.round(baseWind),
    windDirection: Math.round(Math.random() * 360),
    windGusts: Math.round(baseWind * 1.3),
    waveHeight: Math.round(waveHeight * 10) / 10,
    wavePeriod: 4 + Math.round(Math.random() * 4),
    waveDirection: Math.round(Math.random() * 360),
    pressure: 1010 + Math.round(Math.random() * 20),
    airTemp: 18 + Math.round(Math.random() * 10),
    waterTemp: 16 + Math.round(Math.random() * 8),
    visibility: 8 + Math.round(Math.random() * 7),
    humidity: 60 + Math.round(Math.random() * 30),
    condition: waveHeight < 1 ? 'Calm' : waveHeight < 2 ? 'Moderate' : waveHeight < 3 ? 'Rough' : 'Very Rough',
    cloudCover: Math.round(Math.random() * 100),
    precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 5) : 0,
  };
};

/**
 * Get current weather and forecast
 * TODO: Replace with real API integration
 */
export const getMarineWeather = async (lat: number, lng: number): Promise<MarineWeatherForecast> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  /* 
   * TODO: Replace with real API call:
   * 
   * const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
   * const response = await fetch(
   *   `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}`,
   *   { headers: { 'Authorization': API_KEY } }
   * );
   * const data = await response.json();
   * return transformApiResponse(data);
   */
  
  return {
    current: generateMockWeatherData(0),
    hourly: Array.from({ length: 24 }, (_, i) => generateMockWeatherData(i / 24)),
    daily: Array.from({ length: 7 }, (_, i) => generateMockWeatherData(i)),
  };
};

/**
 * Get tide information (for future implementation)
 */
export interface TideData {
  time: string;
  height: number; // meters
  type: 'high' | 'low';
}

export const getTideData = async (lat: number, lng: number): Promise<TideData[]> => {
  // Mock tide data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  return [
    { time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), height: 1.8, type: 'high' },
    { time: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), height: 0.4, type: 'low' },
    { time: new Date(now.getTime() + 14 * 60 * 60 * 1000).toISOString(), height: 1.9, type: 'high' },
    { time: new Date(now.getTime() + 20 * 60 * 60 * 1000).toISOString(), height: 0.3, type: 'low' },
  ];
};
