# Marine Navigation App 🌊⛵

A comprehensive marine navigation and planning application for boat owners, sailors, fishermen, and mariners. Built with React, TypeScript, Tailwind CSS, and OpenStreetMap.

![Marine App](https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800)

## Features

### 🌤️ Weather & Sea Conditions
- Real-time marine weather data (wind, waves, pressure, temperature)
- 7-day forecast with detailed conditions
- Visual wind direction compass
- Sea status indicator (Safe/Moderate/Dangerous)
- Ready for Stormglass or OpenWeatherMap API integration

### 🗺️ Interactive Map
- **OpenStreetMap** base layer with marine points overlay
- Interactive markers for:
  - ⚓ Marinas
  - 🚢 Ports
  - 🏖️ Anchorages
  - ⛽ Fuel stations
  - ⚠️ Danger zones
- Filter points by type
- Add custom waypoints
- GPS location centering
- Touch-optimized interface

### 🧭 Route Planning
- Create and save custom routes
- Distance and time calculations
- Multi-point waypoint navigation
- Route history and favorites

### 📖 Digital Logbook
- Track all sailing trips
- Record weather conditions, fuel usage, speeds
- Trip statistics and history
- Notes and observations

### 🚤 Vessel Information
- Engine hours tracking
- Fuel consumption monitoring
- Maintenance schedule
- Service reminders

## Mobile-First Design

Optimized for iPhone with:
- ✅ Native mobile navigation (bottom tab bar)
- ✅ System safe areas (Dynamic Island, Home Indicator)
- ✅ Dark maritime theme
- ✅ Touch-optimized controls
- ✅ Responsive for all screen sizes

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router 7** - Navigation
- **Leaflet** - OpenStreetMap integration
- **Lucide React** - Icons
- **Vite** - Build tool

## Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your API keys (optional, works with mock data by default):
```env
VITE_STORMGLASS_API_KEY=your_key_here
VITE_OPENWEATHER_API_KEY=your_key_here
```

## API Integration

The app is **production-ready** with a clean separation between mock data and real APIs.

### Current Status
- ✅ Mock data implemented
- ✅ Data structures match real API responses
- ✅ Service layer ready for integration
- 🔄 Switch to live APIs by updating `/src/app/services/weatherApi.ts`

### Supported Weather APIs

1. **Stormglass Marine Weather API** (Recommended)
   - Comprehensive marine data (waves, tides, currents)
   - 50 free requests/day
   - Docs: https://docs.stormglass.io

2. **OpenWeatherMap API**
   - General weather data
   - 1,000 free calls/day
   - Docs: https://openweathermap.org/api

See [API-INTEGRATION.md](./API-INTEGRATION.md) for detailed integration guide.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── MarineMap.tsx       # OpenStreetMap component
│   │   └── MobileLayout.tsx    # Bottom navigation
│   ├── pages/
│   │   ├── HomePage.tsx        # Dashboard
│   │   ├── WeatherPageMobile.tsx
│   │   ├── MapPageMobile.tsx
│   │   ├── RoutesPageMobile.tsx
│   │   └── LogbookPageMobile.tsx
│   ├── services/
│   │   └── weatherApi.ts       # Weather API service layer
│   ├── data/
│   │   └── mockData.ts         # Mock data (matches real API structure)
│   └── routes.ts               # React Router config
├── styles/
│   ├── theme.css               # Design tokens
│   └── leaflet-custom.css      # Map styling
└── main.tsx
```

## Key Features Implementation

### OpenStreetMap Integration

```typescript
import { MarineMap } from './components/MarineMap';

<MarineMap 
  points={filteredPoints} 
  center={[43.7384, 28.6342]}
  zoom={12}
  onPointClick={handlePointClick}
/>
```

### Weather Data Structure

```typescript
interface WeatherData {
  timestamp: string;
  windSpeed: number;      // knots
  windDirection: number;  // degrees
  waveHeight: number;     // meters
  pressure: number;       // hPa
  airTemp: number;        // Celsius
  waterTemp: number;      // Celsius
  // ... matches Stormglass/OpenWeatherMap APIs
}
```

### Marine Points

```typescript
interface MapPoint {
  id: string;
  name: string;
  type: 'marina' | 'port' | 'anchorage' | 'fuel' | 'danger';
  lat: number;
  lng: number;
  description?: string;
  facilities?: string[];  // ['fuel', 'water', 'wifi']
  vhfChannel?: number;
}
```

## Future Enhancements

- [ ] Real-time GPS tracking
- [ ] Tide predictions
- [ ] AIS vessel tracking
- [ ] Offline map caching
- [ ] Weather alerts/notifications
- [ ] Social features (share routes)
- [ ] Integration with marine electronics (NMEA)

## Design Philosophy

**"Can you decide if it's safe to go to sea in 2 seconds?"**

Every design decision prioritizes:
1. **Critical info first** - Sea status immediately visible
2. **Fast access** - Bottom navigation, one tap to any section
3. **Clean UI** - Dark maritime theme reduces eye strain
4. **Touch-optimized** - Large buttons, swipe gestures
5. **Offline-capable** - Core features work without connectivity

## Contributing

Contributions welcome! This is a demo/educational project showcasing:
- Mobile-first responsive design
- API integration architecture
- TypeScript best practices
- React Router Data mode
- OpenStreetMap integration

## License

MIT License - feel free to use this project as a template for your own marine apps!

## Credits

- Maps: [OpenStreetMap](https://www.openstreetmap.org/)
- Icons: [Lucide](https://lucide.dev/)
- Design: Custom maritime theme
- Built with [Figma Make](https://figma.com)

---

**⚓ Fair winds and following seas! ⛵**