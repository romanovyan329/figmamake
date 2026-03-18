/**
 * Mock data for water sports tournament platform
 * 
 * This data structure includes:
 * - Tournament management
 * - Weather data (OpenWeatherMap/Stormglass API)
 * - Map points and navigation
 * - Athlete profiles and results
 */

// Tournament Types
export type SportType = 'Fishing' | 'Sailing' | 'Wake' | 'Jet Ski' | 'Surf' | 'Kayak' | 'Water Ski';
export type TournamentStatus = 'upcoming' | 'live' | 'finished' | 'cancelled';
export type ParticipationStatus = 'registered' | 'completed' | 'withdrawn';

export interface Tournament {
  id: string;
  name: string;
  sportType: SportType;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  dateStart: string;
  dateEnd: string;
  participantsCount: number;
  maxParticipants?: number;
  status: TournamentStatus;
  description: string;
  rules?: string;
  coverImage?: string;
  organizerName?: string;
  entryFee?: number;
  prizePool?: number;
  category?: string; // 'Amateur', 'Pro', 'Junior', etc.
  routePoints?: string[]; // IDs of map points
}

export interface UserTournament {
  userId: string;
  tournamentId: string;
  status: ParticipationStatus;
  registeredAt: string;
  notes?: string;
}

export interface TournamentResult {
  tournamentId: string;
  userId: string;
  rank: number;
  score: number; // time in seconds, weight in kg, or points
  scoreType: 'time' | 'weight' | 'points';
  categoryRank?: number;
  category?: string;
  details?: string;
}

export interface AthleteProfile {
  id: string;
  name: string;
  avatar?: string;
  country?: string;
  totalTournaments: number;
  wins: number;
  topThree: number;
  totalPoints: number;
  favoritesSports: SportType[];
}

export interface WeatherData {
  timestamp: string;
  // Wind data - matches Stormglass/OpenWeatherMap format
  windSpeed: number; // knots
  windDirection: number; // degrees (0-360)
  windGusts: number; // knots
  // Wave data - matches Stormglass format
  waveHeight: number; // meters
  wavePeriod?: number; // seconds
  waveDirection?: number; // degrees
  // Atmospheric data - matches OpenWeatherMap format
  pressure: number; // hPa
  waterTemp: number; // °C
  airTemp: number; // °C
  visibility: number; // km
  humidity?: number; // percentage
  // Conditions
  condition: string;
  cloudCover?: number; // percentage
  precipitation?: number; // mm
}

export interface MapPoint {
  id: string;
  name: string;
  type: 'marina' | 'port' | 'anchorage' | 'fuel' | 'danger' | 'custom';
  lat: number;
  lng: number;
  description?: string;
  // Optional marina/port details
  depth?: number; // meters
  capacity?: number; // number of berths
  facilities?: string[]; // ['fuel', 'water', 'electricity', 'wifi', 'shower']
  vhfChannel?: number;
}

export interface Route {
  id: string;
  name: string;
  points: string[]; // IDs точек
  distance: number; // морские мили
  estimatedTime: number; // часы
  created: string;
}

export interface LogEntry {
  id: string;
  date: string;
  routeName: string;
  duration: number; // часы
  distance: number; // морские мили
  weatherCondition: string;
  notes: string;
  fuelUsed?: number; // liters
  maxSpeed?: number; // knots
  avgSpeed?: number; // knots
  // Trip details
  departureTime?: string; // время выхода
  arrivalTime?: string; // время возвращения
  routePoints?: string[]; // IDs точек маршрута
  timeline?: { time: string; event: string }[]; // хронология событий
  weather?: {
    wind: number; // knots
    waves: number; // meters
    pressure: number; // hPa
    temperature: number; // °C
    visibility: number; // km
    seaCondition: 'Calm' | 'Moderate' | 'Rough';
  };
  photos?: string[]; // URLs фотографий
}

export interface Vessel {
  name: string;
  type: string;
  length: number; // футы
  engineModel: string;
  engineHours: number;
  fuelCapacity: number; // литры
  fuelConsumption: number; // л/час
  lastService: string;
  nextService: string;
}

/**
 * Weather forecast data - matches Stormglass/OpenWeatherMap API response structure
 * 
 * Real API integration example:
 * GET https://api.stormglass.io/v2/weather/point
 * ?lat=43.7384&lng=28.6342&params=windSpeed,waveHeight,waterTemperature
 */
export const weatherForecast: WeatherData[] = [
  {
    timestamp: '2026-03-11T12:00:00Z',
    windSpeed: 12,
    windDirection: 270,
    windGusts: 18,
    waveHeight: 0.8,
    wavePeriod: 5,
    waveDirection: 265,
    pressure: 1013,
    waterTemp: 14,
    airTemp: 16,
    visibility: 15,
    humidity: 65,
    condition: 'Clear',
    cloudCover: 20,
    precipitation: 0
  },
  {
    timestamp: '2026-03-12T12:00:00Z',
    windSpeed: 15,
    windDirection: 280,
    windGusts: 22,
    waveHeight: 1.2,
    wavePeriod: 6,
    waveDirection: 275,
    pressure: 1010,
    waterTemp: 14,
    airTemp: 15,
    visibility: 12,
    humidity: 70,
    condition: 'Partly Cloudy',
    cloudCover: 45,
    precipitation: 0
  },
  {
    timestamp: '2026-03-13T12:00:00Z',
    windSpeed: 20,
    windDirection: 300,
    windGusts: 28,
    waveHeight: 1.8,
    wavePeriod: 7,
    waveDirection: 295,
    pressure: 1005,
    waterTemp: 13,
    airTemp: 14,
    visibility: 8,
    humidity: 75,
    condition: 'Cloudy',
    cloudCover: 80,
    precipitation: 0
  },
  {
    timestamp: '2026-03-14T12:00:00Z',
    windSpeed: 25,
    windDirection: 310,
    windGusts: 35,
    waveHeight: 2.5,
    wavePeriod: 8,
    waveDirection: 305,
    pressure: 998,
    waterTemp: 13,
    airTemp: 12,
    visibility: 6,
    humidity: 85,
    condition: 'Rain',
    cloudCover: 95,
    precipitation: 8
  },
  {
    timestamp: '2026-03-15T12:00:00Z',
    windSpeed: 18,
    windDirection: 290,
    windGusts: 25,
    waveHeight: 1.5,
    wavePeriod: 6,
    waveDirection: 285,
    pressure: 1002,
    waterTemp: 13,
    airTemp: 13,
    visibility: 10,
    humidity: 72,
    condition: 'Partly Cloudy',
    cloudCover: 50,
    precipitation: 1
  },
  {
    timestamp: '2026-03-16T12:00:00Z',
    windSpeed: 10,
    windDirection: 260,
    windGusts: 15,
    waveHeight: 0.6,
    wavePeriod: 4,
    waveDirection: 255,
    pressure: 1015,
    waterTemp: 14,
    airTemp: 16,
    visibility: 20,
    humidity: 60,
    condition: 'Clear',
    cloudCover: 15,
    precipitation: 0
  },
  {
    timestamp: '2026-03-17T12:00:00Z',
    windSpeed: 8,
    windDirection: 250,
    windGusts: 12,
    waveHeight: 0.4,
    wavePeriod: 3,
    waveDirection: 245,
    pressure: 1018,
    waterTemp: 15,
    airTemp: 18,
    visibility: 25,
    humidity: 55,
    condition: 'Clear',
    cloudCover: 10,
    precipitation: 0
  }
];

/**
 * Marine points - can be enriched with OpenSeaMap or custom POI API
 * 
 * Example coordinates: Black Sea region (Odessa area)
 */
export const mapPoints: MapPoint[] = [
  {
    id: '1',
    name: 'Odessa Sea Port',
    type: 'port',
    lat: 46.4825,
    lng: 30.7233,
    description: 'Main commercial sea port',
    depth: 12,
    vhfChannel: 16,
    facilities: ['fuel', 'water', 'customs']
  },
  {
    id: '2',
    name: 'Marina "Sea Breeze"',
    type: 'marina',
    lat: 46.4900,
    lng: 30.7400,
    description: 'Modern marina with full service',
    depth: 5,
    capacity: 120,
    facilities: ['fuel', 'water', 'electricity', 'wifi', 'shower', 'restaurant'],
    vhfChannel: 9
  },
  {
    id: '3',
    name: 'Lighthouse Anchorage',
    type: 'anchorage',
    lat: 46.5100,
    lng: 30.7800,
    description: 'Protected anchorage, depth 8-12m',
    depth: 10,
    facilities: []
  },
  {
    id: '4',
    name: 'Marine Fuel Station',
    type: 'fuel',
    lat: 46.4850,
    lng: 30.7300,
    description: 'Diesel fuel, gasoline',
    facilities: ['fuel'],
    vhfChannel: 12
  },
  {
    id: '5',
    name: 'Danger Zone - Shallow',
    type: 'danger',
    lat: 46.5200,
    lng: 30.8000,
    description: 'Rocky shallow area, depth less than 2m',
    depth: 1.5
  },
  {
    id: '6',
    name: 'Fishing Harbor',
    type: 'anchorage',
    lat: 46.4700,
    lng: 30.7100,
    description: 'Local fishing anchorage',
    depth: 4
  },
  {
    id: '7',
    name: 'Arcadia Beach Marina',
    type: 'marina',
    lat: 46.4300,
    lng: 30.7650,
    description: 'Tourist marina near beaches',
    depth: 4,
    capacity: 80,
    facilities: ['water', 'electricity', 'wifi', 'restaurant', 'shower']
  },
  {
    id: '8',
    name: 'Northern Port Entrance',
    type: 'port',
    lat: 46.5050,
    lng: 30.7150,
    description: 'Industrial port area',
    depth: 15,
    vhfChannel: 16
  }
];

// Сохраненные маршруты
export const savedRoutes: Route[] = [
  {
    id: '1',
    name: 'Odessa - Marina - Lighthouse',
    points: ['1', '2', '3'],
    distance: 8.5,
    estimatedTime: 2.5,
    created: '2026-02-15'
  },
  {
    id: '2',
    name: 'Round Trip',
    points: ['2', '3', '6', '2'],
    distance: 12.3,
    estimatedTime: 3.5,
    created: '2026-02-20'
  },
  {
    id: '3',
    name: 'Fishing at Lighthouse',
    points: ['2', '4', '3'],
    distance: 6.2,
    estimatedTime: 2.0,
    created: '2026-03-01'
  }
];

// Журнал выходов
export const logbookEntries: LogEntry[] = [
  {
    id: '1',
    date: '2026-03-08',
    routeName: 'Odessa - Marina - Lighthouse',
    duration: 2.8,
    distance: 8.5,
    weatherCondition: 'Clear, wind 10 knots, waves 0.5m',
    notes: 'Perfect day for sailing. Saw dolphins near lighthouse.',
    fuelUsed: 78,
    maxSpeed: 18,
    avgSpeed: 12,
    departureTime: '09:10',
    arrivalTime: '11:55',
    routePoints: ['1', '2', '3'],
    timeline: [
      { time: '09:10', event: 'Depart Marina' },
      { time: '10:00', event: 'Fishing stop' },
      { time: '11:20', event: 'Return route' },
      { time: '11:55', event: 'Arrived Marina' }
    ],
    weather: {
      wind: 10,
      waves: 0.5,
      pressure: 1013,
      temperature: 16,
      visibility: 15,
      seaCondition: 'Calm'
    }
  },
  {
    id: '2',
    date: '2026-03-05',
    routeName: 'Fishing at Lighthouse',
    duration: 4.5,
    distance: 6.2,
    weatherCondition: 'Partly cloudy, wind 12 knots',
    notes: 'Good fishing. Caught several mullets. Slight swell on return.',
    fuelUsed: 126,
    maxSpeed: 15,
    avgSpeed: 8,
    departureTime: '08:30',
    arrivalTime: '13:00',
    routePoints: ['2', '4', '3'],
    timeline: [
      { time: '08:30', event: 'Depart Marina' },
      { time: '09:15', event: 'Fuel stop' },
      { time: '10:00', event: 'Arrived at Lighthouse' },
      { time: '12:30', event: 'Start return' },
      { time: '13:00', event: 'Arrived Marina' }
    ],
    weather: {
      wind: 12,
      waves: 0.8,
      pressure: 1010,
      temperature: 15,
      visibility: 12,
      seaCondition: 'Moderate'
    }
  },
  {
    id: '3',
    date: '2026-02-28',
    routeName: 'Round Trip',
    duration: 3.2,
    distance: 12.3,
    weatherCondition: 'Clear, wind 8 knots',
    notes: 'Testing new GPS navigator. Everything works perfectly.',
    fuelUsed: 90,
    maxSpeed: 20,
    avgSpeed: 14,
    departureTime: '10:00',
    arrivalTime: '13:12',
    routePoints: ['2', '3', '6', '2'],
    timeline: [
      { time: '10:00', event: 'Depart Marina' },
      { time: '11:00', event: 'Pass Lighthouse' },
      { time: '12:00', event: 'Fishing Harbor stop' },
      { time: '13:12', event: 'Return to Marina' }
    ],
    weather: {
      wind: 8,
      waves: 0.4,
      pressure: 1015,
      temperature: 18,
      visibility: 20,
      seaCondition: 'Calm'
    }
  },
  {
    id: '4',
    date: '2026-02-22',
    routeName: 'Odessa - Marina',
    duration: 1.5,
    distance: 4.2,
    weatherCondition: 'Cloudy, wind 15 knots, waves 1.2m',
    notes: 'A bit choppy. Maintenance service at marina.',
    fuelUsed: 42,
    maxSpeed: 16,
    avgSpeed: 11,
    departureTime: '14:00',
    arrivalTime: '15:30',
    routePoints: ['1', '2'],
    timeline: [
      { time: '14:00', event: 'Depart Port' },
      { time: '15:30', event: 'Arrived Marina for service' }
    ],
    weather: {
      wind: 15,
      waves: 1.2,
      pressure: 1005,
      temperature: 14,
      visibility: 10,
      seaCondition: 'Moderate'
    }
  },
  {
    id: '5',
    date: '2026-02-15',
    routeName: 'Fishing at Lighthouse',
    duration: 5.0,
    distance: 6.2,
    weatherCondition: 'Clear, wind 7 knots',
    notes: 'Excellent weather. Long fishing session. Relaxed at anchorage.',
    fuelUsed: 140,
    maxSpeed: 12,
    avgSpeed: 6,
    departureTime: '07:00',
    arrivalTime: '12:00',
    routePoints: ['2', '4', '3'],
    timeline: [
      { time: '07:00', event: 'Early departure' },
      { time: '08:00', event: 'Arrived at Lighthouse' },
      { time: '11:30', event: 'Start return' },
      { time: '12:00', event: 'Back to Marina' }
    ],
    weather: {
      wind: 7,
      waves: 0.3,
      pressure: 1018,
      temperature: 17,
      visibility: 25,
      seaCondition: 'Calm'
    }
  }
];

// Информация о судне
export const vesselInfo: Vessel = {
  name: 'Sea Wanderer',
  type: 'Motor Yacht',
  length: 32,
  engineModel: 'Volvo Penta D6-370',
  engineHours: 1245,
  fuelCapacity: 800,
  fuelConsumption: 28,
  lastService: '2026-01-15',
  nextService: '2026-07-15'
};

// Турниры
export const tournaments: Tournament[] = [
  {
    id: '1',
    name: 'Black Sea Fishing Championship',
    sportType: 'Fishing',
    location: {
      name: 'Odessa Sea Port',
      lat: 46.4825,
      lng: 30.7233
    },
    dateStart: '2026-04-01',
    dateEnd: '2026-04-05',
    participantsCount: 50,
    maxParticipants: 100,
    status: 'upcoming',
    description: 'Annual fishing championship in the Black Sea.',
    rules: 'Participants must catch the largest fish to win.',
    coverImage: 'https://example.com/images/fishing_championship.jpg',
    organizerName: 'Black Sea Sports Association',
    entryFee: 100,
    prizePool: 5000,
    category: 'Amateur',
    routePoints: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Sailing Race',
    sportType: 'Sailing',
    location: {
      name: 'Marina "Sea Breeze"',
      lat: 46.4900,
      lng: 30.7400
    },
    dateStart: '2026-05-15',
    dateEnd: '2026-05-16',
    participantsCount: 30,
    maxParticipants: 50,
    status: 'upcoming',
    description: 'Sailing race around the Black Sea.',
    rules: 'Participants must complete the course in the shortest time.',
    coverImage: 'https://example.com/images/sailing_race.jpg',
    organizerName: 'Black Sea Sports Association',
    entryFee: 150,
    prizePool: 3000,
    category: 'Pro',
    routePoints: ['2', '3', '6', '2']
  },
  {
    id: '3',
    name: 'Wakeboarding Competition',
    sportType: 'Wake',
    location: {
      name: 'Lighthouse Anchorage',
      lat: 46.5100,
      lng: 30.7800
    },
    dateStart: '2026-06-01',
    dateEnd: '2026-06-02',
    participantsCount: 20,
    maxParticipants: 30,
    status: 'upcoming',
    description: 'Wakeboarding competition in the Black Sea.',
    rules: 'Participants must perform the best tricks.',
    coverImage: 'https://example.com/images/wakeboarding_competition.jpg',
    organizerName: 'Black Sea Sports Association',
    entryFee: 200,
    prizePool: 2000,
    category: 'Amateur',
    routePoints: ['2', '4', '3']
  },
  {
    id: '4',
    name: 'WASZP Games 2026',
    sportType: 'Sailing',
    location: {
      name: 'Pensacola, USA',
      lat: 30.4213,
      lng: -87.2169
    },
    dateStart: '2026-03-22',
    dateEnd: '2026-03-28',
    participantsCount: 120,
    maxParticipants: 200,
    status: 'upcoming',
    description: 'International WASZP foiling dinghy championship featuring the world\'s best sailors.',
    rules: 'Single-handed foiling dinghy racing following World Sailing regulations.',
    organizerName: 'WASZP Class Association',
    entryFee: 250,
    prizePool: 15000,
    category: 'Pro'
  },
  {
    id: '5',
    name: 'Asian Beach Games 2026',
    sportType: 'Kayak',
    location: {
      name: 'Sanya, China',
      lat: 18.2528,
      lng: 109.5117
    },
    dateStart: '2026-04-22',
    dateEnd: '2026-04-30',
    participantsCount: 450,
    maxParticipants: 600,
    status: 'upcoming',
    description: 'Multi-sport beach games featuring water sports competitions from across Asia.',
    rules: 'Various water sports disciplines including kayaking, beach volleyball, and water polo.',
    organizerName: 'Olympic Council of Asia',
    entryFee: 300,
    prizePool: 50000,
    category: 'Pro'
  },
  {
    id: '6',
    name: 'Nautique Masters',
    sportType: 'Wake',
    location: {
      name: 'USA',
      lat: 37.0902,
      lng: -95.7129
    },
    dateStart: '2026-05-22',
    dateEnd: '2026-05-24',
    participantsCount: 45,
    maxParticipants: 60,
    status: 'upcoming',
    description: 'Elite wakeboarding competition featuring the world\'s top riders.',
    rules: 'Advanced tricks and technical performance judged by international panel.',
    organizerName: 'Nautique Boat Company',
    entryFee: 350,
    prizePool: 25000,
    category: 'Pro'
  },
  {
    id: '7',
    name: 'WWA Wakeboard Nationals',
    sportType: 'Wake',
    location: {
      name: 'Florida, USA',
      lat: 27.6648,
      lng: -81.5158
    },
    dateStart: '2026-07-22',
    dateEnd: '2026-07-26',
    participantsCount: 80,
    maxParticipants: 120,
    status: 'upcoming',
    description: 'National wakeboarding championship sanctioned by World Wake Association.',
    rules: 'Multiple divisions including amateur and pro categories with qualifying rounds.',
    organizerName: 'World Wake Association',
    entryFee: 200,
    prizePool: 18000,
    category: 'Pro'
  },
  {
    id: '8',
    name: 'SailGP Valencia',
    sportType: 'Sailing',
    location: {
      name: 'Valencia, Spain',
      lat: 39.4699,
      lng: -0.3763
    },
    dateStart: '2026-09-05',
    dateEnd: '2026-09-06',
    participantsCount: 10,
    maxParticipants: 12,
    status: 'upcoming',
    description: 'High-speed foiling catamaran racing featuring national teams in F50 boats.',
    rules: 'Short-course racing format with multiple fleet races and winner-takes-all final.',
    organizerName: 'SailGP',
    entryFee: 0,
    prizePool: 100000,
    category: 'Pro'
  },
  {
    id: '9',
    name: 'World Wake Surfing Championship',
    sportType: 'Wake',
    location: {
      name: 'Florida, USA',
      lat: 27.6648,
      lng: -81.5158
    },
    dateStart: '2026-10-01',
    dateEnd: '2026-10-03',
    participantsCount: 60,
    maxParticipants: 100,
    status: 'upcoming',
    description: 'World championship for wake surfing featuring surf-style tricks behind the boat.',
    rules: 'Judged on style, flow, and technical difficulty of maneuvers.',
    organizerName: 'World Wake Surf Association',
    entryFee: 175,
    prizePool: 12000,
    category: 'Pro'
  },
  {
    id: '10',
    name: 'Aquabike GP Italy',
    sportType: 'Jet Ski',
    location: {
      name: 'Olbia, Italy',
      lat: 40.9237,
      lng: 9.4967
    },
    dateStart: '2026-10-16',
    dateEnd: '2026-10-18',
    participantsCount: 35,
    maxParticipants: 50,
    status: 'upcoming',
    description: 'International jet ski racing championship on the Mediterranean coast.',
    rules: 'Multiple heat races with championship points system following UIM regulations.',
    organizerName: 'Union Internationale Motonautique',
    entryFee: 400,
    prizePool: 30000,
    category: 'Pro'
  },
  {
    id: '11',
    name: 'Mark Hahn Memorial Havasu 300',
    sportType: 'Jet Ski',
    location: {
      name: 'Lake Havasu, Arizona, USA',
      lat: 34.4839,
      lng: -114.3224
    },
    dateStart: '2026-02-28',
    dateEnd: '2026-02-28',
    participantsCount: 150,
    maxParticipants: 200,
    status: 'upcoming',
    description: 'Legendary 300-mile desert endurance race for personal watercraft.',
    rules: 'Extreme endurance racing across desert waters with multiple checkpoints.',
    organizerName: 'IJSBA',
    entryFee: 500,
    prizePool: 40000,
    category: 'Pro'
  },
  {
    id: '12',
    name: 'Aquabike GP Shanghai',
    sportType: 'Jet Ski',
    location: {
      name: 'Shanghai, China',
      lat: 31.2304,
      lng: 121.4737
    },
    dateStart: '2026-10-01',
    dateEnd: '2026-10-02',
    participantsCount: 40,
    maxParticipants: 60,
    status: 'upcoming',
    description: 'High-speed jet ski racing on the Huangpu River featuring international competitors.',
    rules: 'Circuit racing with qualifying heats and championship finals.',
    organizerName: 'UIM Aquabike World Championship',
    entryFee: 450,
    prizePool: 35000,
    category: 'Pro'
  },
  {
    id: '13',
    name: 'WGP#1 World Finals',
    sportType: 'Jet Ski',
    location: {
      name: 'Lake Havasu, Arizona, USA',
      lat: 34.4839,
      lng: -114.3224
    },
    dateStart: '2026-10-03',
    dateEnd: '2026-10-11',
    participantsCount: 200,
    maxParticipants: 300,
    status: 'upcoming',
    description: 'World championship finale for personal watercraft racing with multiple classes.',
    rules: 'Multi-day event with different race formats and classes including freestyle.',
    organizerName: 'World Jet Sports',
    entryFee: 600,
    prizePool: 80000,
    category: 'Pro'
  },
  {
    id: '14',
    name: 'GP Qatar',
    sportType: 'Jet Ski',
    location: {
      name: 'Doha, Qatar',
      lat: 25.2854,
      lng: 51.5310
    },
    dateStart: '2026-11-19',
    dateEnd: '2026-11-21',
    participantsCount: 50,
    maxParticipants: 70,
    status: 'upcoming',
    description: 'Middle East Grand Prix featuring elite jet ski racers on the Arabian Gulf.',
    rules: 'International circuit racing following UIM regulations with night racing.',
    organizerName: 'Qatar Marine Sports Federation',
    entryFee: 550,
    prizePool: 60000,
    category: 'Pro'
  },
  {
    id: '15',
    name: 'IWWF World U17 Championship',
    sportType: 'Water Ski',
    location: {
      name: 'Buenos Aires, Argentina',
      lat: -34.6037,
      lng: -58.3816
    },
    dateStart: '2026-03-30',
    dateEnd: '2026-04-05',
    participantsCount: 80,
    maxParticipants: 120,
    status: 'upcoming',
    description: 'Youth world championship for water skiing featuring slalom, tricks, and jump.',
    rules: 'Under-17 competition sanctioned by IWWF with three disciplines.',
    organizerName: 'International Waterski & Wakeboard Federation',
    entryFee: 200,
    prizePool: 15000,
    category: 'Junior'
  },
  {
    id: '16',
    name: 'Hong Kong Open Waterski',
    sportType: 'Water Ski',
    location: {
      name: 'Hong Kong',
      lat: 22.3193,
      lng: 114.1694
    },
    dateStart: '2026-03-28',
    dateEnd: '2026-03-29',
    participantsCount: 45,
    maxParticipants: 70,
    status: 'upcoming',
    description: 'Asia-Pacific water ski championship in Victoria Harbour.',
    rules: 'Traditional water skiing competition with slalom, tricks, and jump events.',
    organizerName: 'Hong Kong Water Ski Association',
    entryFee: 180,
    prizePool: 12000,
    category: 'Pro'
  },
  {
    id: '17',
    name: 'Japan Wakesurf Open',
    sportType: 'Wake',
    location: {
      name: 'Tokyo, Japan',
      lat: 35.6762,
      lng: 139.6503
    },
    dateStart: '2026-05-15',
    dateEnd: '2026-05-17',
    participantsCount: 55,
    maxParticipants: 80,
    status: 'upcoming',
    description: 'Premier wake surfing event in Asia featuring skim and surf style competitions.',
    rules: 'Judges score based on wave riding, tricks, and flow behind the boat.',
    organizerName: 'Japan Wake Sports Federation',
    entryFee: 220,
    prizePool: 18000,
    category: 'Pro'
  },
  {
    id: '18',
    name: 'Asian Games Sailing',
    sportType: 'Sailing',
    location: {
      name: 'Aichi-Nagoya, Japan',
      lat: 35.1815,
      lng: 136.9066
    },
    dateStart: '2026-09-26',
    dateEnd: '2026-10-03',
    participantsCount: 250,
    maxParticipants: 300,
    status: 'upcoming',
    description: 'Olympic-level sailing competition for Asian Games with multiple classes.',
    rules: 'Fleet racing in various Olympic sailing classes following World Sailing rules.',
    organizerName: 'Olympic Council of Asia',
    entryFee: 0,
    prizePool: 0,
    category: 'Pro'
  },
  {
    id: '19',
    name: 'Melilla Nautical Week 2026',
    sportType: 'Sailing',
    location: {
      name: 'Melilla, Spain',
      lat: 35.2923,
      lng: -2.9381
    },
    dateStart: '2026-08-15',
    dateEnd: '2026-08-22',
    participantsCount: 120,
    maxParticipants: 180,
    status: 'upcoming',
    description: 'Multi-discipline nautical festival featuring sailing races and fishing competitions.',
    rules: 'Week-long event with daily sailing regattas and fishing tournaments.',
    organizerName: 'Melilla Yacht Club',
    entryFee: 150,
    prizePool: 20000,
    category: 'Amateur'
  },
  {
    id: '20',
    name: 'Big Rock Blue Marlin Tournament',
    sportType: 'Fishing',
    location: {
      name: 'Morehead City, North Carolina, USA',
      lat: 34.7232,
      lng: -76.7268
    },
    dateStart: '2026-06-06',
    dateEnd: '2026-06-14',
    participantsCount: 200,
    maxParticipants: 250,
    status: 'upcoming',
    description: 'One of the world\'s most prestigious blue marlin fishing tournaments with record prize money.',
    rules: 'Big game fishing tournament targeting blue marlin with weight-based scoring.',
    organizerName: 'Big Rock Blue Marlin Tournament',
    entryFee: 3500,
    prizePool: 1500000,
    category: 'Pro'
  },
  {
    id: '21',
    name: 'White Marlin Open',
    sportType: 'Fishing',
    location: {
      name: 'Ocean City, Maryland, USA',
      lat: 38.3365,
      lng: -75.0849
    },
    dateStart: '2026-08-03',
    dateEnd: '2026-08-07',
    participantsCount: 350,
    maxParticipants: 400,
    status: 'upcoming',
    description: 'World\'s largest billfish tournament with multi-million dollar prize purse.',
    rules: 'Catch and release format targeting white marlin, blue marlin, tuna, and wahoo.',
    organizerName: 'White Marlin Open',
    entryFee: 2500,
    prizePool: 2000000,
    category: 'Pro'
  },
  {
    id: '22',
    name: 'Bisbee\'s Black & Blue',
    sportType: 'Fishing',
    location: {
      name: 'Cabo San Lucas, Mexico',
      lat: 22.8905,
      lng: -109.9167
    },
    dateStart: '2026-10-20',
    dateEnd: '2026-10-24',
    participantsCount: 150,
    maxParticipants: 200,
    status: 'upcoming',
    description: 'Legendary marlin tournament in Los Cabos, known for massive prize money.',
    rules: 'Big game fishing targeting black and blue marlin in Pacific waters.',
    organizerName: 'Bisbee\'s Fish & Wildlife Conservation Fund',
    entryFee: 5000,
    prizePool: 3000000,
    category: 'Pro'
  },
  {
    id: '23',
    name: 'World Carp Classic',
    sportType: 'Fishing',
    location: {
      name: 'Champagne Region, France',
      lat: 49.0425,
      lng: 3.9617
    },
    dateStart: '2026-09-10',
    dateEnd: '2026-09-13',
    participantsCount: 80,
    maxParticipants: 100,
    status: 'upcoming',
    description: 'Premier international carp fishing championship in French lakes.',
    rules: 'Catch and release carp fishing with points based on total weight caught.',
    organizerName: 'World Carp Federation',
    entryFee: 500,
    prizePool: 50000,
    category: 'Pro'
  },
  {
    id: '24',
    name: 'Rolex Fastnet Race',
    sportType: 'Sailing',
    location: {
      name: 'Cowes, UK to Cherbourg, France',
      lat: 50.7625,
      lng: -1.2987
    },
    dateStart: '2026-07-26',
    dateEnd: '2026-08-02',
    participantsCount: 400,
    maxParticipants: 500,
    status: 'upcoming',
    description: 'Classic offshore yacht race around Fastnet Rock, one of sailing\'s toughest challenges.',
    rules: 'Offshore racing covering 695 nautical miles with IRC and IMOCA classes.',
    organizerName: 'Royal Ocean Racing Club',
    entryFee: 800,
    prizePool: 0,
    category: 'Pro'
  },
  {
    id: '25',
    name: 'Sydney to Hobart Yacht Race',
    sportType: 'Sailing',
    location: {
      name: 'Sydney to Hobart, Australia',
      lat: -33.8688,
      lng: 151.2093
    },
    dateStart: '2026-12-26',
    dateEnd: '2026-12-30',
    participantsCount: 120,
    maxParticipants: 150,
    status: 'upcoming',
    description: 'Iconic Boxing Day yacht race through treacherous Bass Strait.',
    rules: '628 nautical miles offshore race with multiple divisions and handicap systems.',
    organizerName: 'Cruising Yacht Club of Australia',
    entryFee: 1200,
    prizePool: 0,
    category: 'Pro'
  },
  {
    id: '26',
    name: 'America\'s Cup Preliminary Regatta',
    sportType: 'Sailing',
    location: {
      name: 'Barcelona, Spain',
      lat: 41.3851,
      lng: 2.1734
    },
    dateStart: '2026-06-15',
    dateEnd: '2026-06-25',
    participantsCount: 8,
    maxParticipants: 10,
    status: 'upcoming',
    description: 'Preliminary races for the world\'s oldest international sporting trophy.',
    rules: 'AC75 foiling monohull racing with match racing format.',
    organizerName: 'America\'s Cup Event Authority',
    entryFee: 0,
    prizePool: 0,
    category: 'Pro'
  },
  {
    id: '27',
    name: 'Kiel Week Sailing',
    sportType: 'Sailing',
    location: {
      name: 'Kiel, Germany',
      lat: 54.3233,
      lng: 10.1394
    },
    dateStart: '2026-06-20',
    dateEnd: '2026-06-28',
    participantsCount: 5000,
    maxParticipants: 6000,
    status: 'upcoming',
    description: 'World\'s largest sailing event with races, maritime festival, and concerts.',
    rules: 'Multiple racing series across all sailing classes and age groups.',
    organizerName: 'Kieler Woche Organizing Committee',
    entryFee: 150,
    prizePool: 0,
    category: 'Amateur'
  },
  {
    id: '28',
    name: 'ISA World Surfing Games',
    sportType: 'Surf',
    location: {
      name: 'TBD',
      lat: 0,
      lng: 0
    },
    dateStart: '2026-09-10',
    dateEnd: '2026-09-18',
    participantsCount: 300,
    maxParticipants: 400,
    status: 'upcoming',
    description: 'Olympic qualifying event and world championship for amateur and junior surfers.',
    rules: 'Multiple divisions including open, junior, and longboard with heat-based format.',
    organizerName: 'International Surfing Association',
    entryFee: 200,
    prizePool: 100000,
    category: 'Pro'
  },
  {
    id: '29',
    name: 'WSL Championship Tour – Pipeline',
    sportType: 'Surf',
    location: {
      name: 'Pipeline, Oahu, Hawaii, USA',
      lat: 21.6647,
      lng: -158.0538
    },
    dateStart: '2026-01-20',
    dateEnd: '2026-02-02',
    participantsCount: 36,
    maxParticipants: 40,
    status: 'upcoming',
    description: 'Most prestigious surf competition at the world\'s most dangerous wave.',
    rules: 'WSL Championship Tour event with 5-point judging system for wave performance.',
    organizerName: 'World Surf League',
    entryFee: 0,
    prizePool: 250000,
    category: 'Pro'
  },
  {
    id: '30',
    name: 'WSL Finals',
    sportType: 'Surf',
    location: {
      name: 'Lower Trestles, California, USA',
      lat: 33.3894,
      lng: -117.5931
    },
    dateStart: '2026-09-08',
    dateEnd: '2026-09-16',
    participantsCount: 10,
    maxParticipants: 10,
    status: 'upcoming',
    description: 'Winner-takes-all final to crown the world surfing champion.',
    rules: 'Top 5 men and women compete in single-elimination format for world title.',
    organizerName: 'World Surf League',
    entryFee: 0,
    prizePool: 500000,
    category: 'Pro'
  },
  {
    id: '31',
    name: 'Rip Curl Pro Portugal',
    sportType: 'Surf',
    location: {
      name: 'Peniche, Portugal',
      lat: 39.3558,
      lng: -9.3811
    },
    dateStart: '2026-03-10',
    dateEnd: '2026-03-20',
    participantsCount: 36,
    maxParticipants: 40,
    status: 'upcoming',
    description: 'European leg of WSL Championship Tour in powerful Atlantic surf.',
    rules: 'Championship Tour event with multiple heat rounds and progressive format.',
    organizerName: 'World Surf League',
    entryFee: 0,
    prizePool: 180000,
    category: 'Pro'
  },
  {
    id: '32',
    name: 'Aquabike GP France',
    sportType: 'Jet Ski',
    location: {
      name: 'Vichy, France',
      lat: 46.1277,
      lng: 3.4290
    },
    dateStart: '2026-07-10',
    dateEnd: '2026-07-12',
    participantsCount: 45,
    maxParticipants: 60,
    status: 'upcoming',
    description: 'European championship round on the scenic Allier River.',
    rules: 'Circuit racing with Runabout and Ski divisions following UIM regulations.',
    organizerName: 'UIM Aquabike World Championship',
    entryFee: 420,
    prizePool: 32000,
    category: 'Pro'
  },
  {
    id: '33',
    name: 'Aquabike GP Hungary',
    sportType: 'Jet Ski',
    location: {
      name: 'Dunaujvaros, Hungary',
      lat: 46.9619,
      lng: 18.9350
    },
    dateStart: '2026-08-07',
    dateEnd: '2026-08-09',
    participantsCount: 50,
    maxParticipants: 70,
    status: 'upcoming',
    description: 'High-speed jet ski racing on the Danube River.',
    rules: 'UIM world championship points race with qualifying heats and finals.',
    organizerName: 'Hungarian Jet Sport Federation',
    entryFee: 400,
    prizePool: 28000,
    category: 'Pro'
  },
  {
    id: '34',
    name: 'European Jet Ski Championship',
    sportType: 'Jet Ski',
    location: {
      name: 'Gdynia, Poland',
      lat: 54.5189,
      lng: 18.5305
    },
    dateStart: '2026-06-12',
    dateEnd: '2026-06-14',
    participantsCount: 80,
    maxParticipants: 100,
    status: 'upcoming',
    description: 'Continental championship on the Baltic Sea.',
    rules: 'Multiple classes including stock and modified with European championship points.',
    organizerName: 'European Jet Sport Federation',
    entryFee: 350,
    prizePool: 25000,
    category: 'Pro'
  },
  {
    id: '35',
    name: 'ICF Canoe Sprint World Cup',
    sportType: 'Kayak',
    location: {
      name: 'Szeged, Hungary',
      lat: 46.2530,
      lng: 20.1414
    },
    dateStart: '2026-05-15',
    dateEnd: '2026-05-17',
    participantsCount: 400,
    maxParticipants: 500,
    status: 'upcoming',
    description: 'Olympic-level sprint kayak and canoe racing on flat water.',
    rules: 'ICF regulations for 200m, 500m, and 1000m sprint races in K1-K4 and C1-C4.',
    organizerName: 'International Canoe Federation',
    entryFee: 100,
    prizePool: 50000,
    category: 'Pro'
  },
  {
    id: '36',
    name: 'ICF Canoe Slalom World Cup',
    sportType: 'Kayak',
    location: {
      name: 'Prague, Czech Republic',
      lat: 50.0755,
      lng: 14.4378
    },
    dateStart: '2026-06-19',
    dateEnd: '2026-06-21',
    participantsCount: 250,
    maxParticipants: 300,
    status: 'upcoming',
    description: 'Whitewater slalom racing through gates on artificial course.',
    rules: 'Technical slalom racing in K1, C1, and C2 classes with time penalties for gate touches.',
    organizerName: 'International Canoe Federation',
    entryFee: 120,
    prizePool: 40000,
    category: 'Pro'
  },
  {
    id: '37',
    name: 'Canoe Marathon World Championships',
    sportType: 'Kayak',
    location: {
      name: 'Pontevedra, Spain',
      lat: 42.4333,
      lng: -8.6500
    },
    dateStart: '2026-09-17',
    dateEnd: '2026-09-20',
    participantsCount: 600,
    maxParticipants: 700,
    status: 'upcoming',
    description: 'World championship for long-distance canoe and kayak racing.',
    rules: 'Marathon distance racing with portages, multiple classes and age groups.',
    organizerName: 'International Canoe Federation',
    entryFee: 90,
    prizePool: 30000,
    category: 'Pro'
  },
  {
    id: '38',
    name: 'Malibu Rider Experience',
    sportType: 'Wake',
    location: {
      name: 'Various locations, USA',
      lat: 34.0259,
      lng: -118.7798
    },
    dateStart: '2026-06-05',
    dateEnd: '2026-06-08',
    participantsCount: 100,
    maxParticipants: 150,
    status: 'upcoming',
    description: 'Amateur and pro wakeboard tour sponsored by Malibu Boats.',
    rules: 'Multiple stops across USA with tricks competition and amateur divisions.',
    organizerName: 'Malibu Boats',
    entryFee: 250,
    prizePool: 20000,
    category: 'Amateur'
  },
  {
    id: '39',
    name: 'European Wakeboard Championship',
    sportType: 'Wake',
    location: {
      name: 'Lake Como, Italy',
      lat: 45.9993,
      lng: 9.2697
    },
    dateStart: '2026-08-10',
    dateEnd: '2026-08-15',
    participantsCount: 120,
    maxParticipants: 160,
    status: 'upcoming',
    description: 'Continental championship featuring Europe\'s best wakeboarders.',
    rules: 'IWWF sanctioned event with multiple divisions and technical judging.',
    organizerName: 'European Waterski & Wakeboard Federation',
    entryFee: 280,
    prizePool: 35000,
    category: 'Pro'
  },
  {
    id: '40',
    name: 'Winter Bass Pro Tournament',
    sportType: 'Fishing',
    location: {
      name: 'Lake Okeechobee, Florida',
      lat: 26.9853,
      lng: -80.8003
    },
    dateStart: '2026-02-20',
    dateEnd: '2026-02-22',
    participantsCount: 85,
    maxParticipants: 100,
    status: 'finished',
    description: 'Elite bass fishing tournament with top anglers from around the world.',
    rules: 'Catch and release format. Biggest bass wins. All fish must be documented with photos.',
    organizerName: 'Bass Anglers Federation',
    entryFee: 500,
    prizePool: 50000,
    category: 'Pro'
  }
];

// Участие пользователей в турнирах
export const userTournaments: UserTournament[] = [
  {
    userId: '1',
    tournamentId: '1',
    status: 'registered',
    registeredAt: '2026-03-20'
  },
  {
    userId: '2',
    tournamentId: '2',
    status: 'completed',
    registeredAt: '2026-04-10',
    notes: 'Finished in 2nd place'
  },
  {
    userId: '3',
    tournamentId: '3',
    status: 'withdrawn',
    registeredAt: '2026-05-05'
  },
  {
    userId: '1',
    tournamentId: '40',
    status: 'completed',
    registeredAt: '2026-02-01',
    notes: 'Finished in 3rd place'
  }
];

// Результаты турниров
export const tournamentResults: TournamentResult[] = [
  {
    tournamentId: '1',
    userId: '1',
    rank: 1,
    score: 150,
    scoreType: 'weight',
    categoryRank: 1,
    category: 'Amateur',
    details: 'Caught the largest fish'
  },
  {
    tournamentId: '2',
    userId: '2',
    rank: 2,
    score: 120,
    scoreType: 'time',
    categoryRank: 2,
    category: 'Pro',
    details: 'Completed the course in 2nd place'
  },
  {
    tournamentId: '3',
    userId: '3',
    rank: 3,
    score: 100,
    scoreType: 'points',
    categoryRank: 3,
    category: 'Amateur',
    details: 'Performed the best tricks'
  },
  // Winter Bass Pro Tournament Results (Tournament ID: 40)
  {
    tournamentId: '40',
    userId: '101',
    rank: 1,
    score: 28.5,
    scoreType: 'weight',
    categoryRank: 1,
    category: 'Pro',
    details: 'Largest bass: 28.5 lbs. Dominated the tournament with exceptional technique.'
  },
  {
    tournamentId: '40',
    userId: '102',
    rank: 2,
    score: 26.8,
    scoreType: 'weight',
    categoryRank: 2,
    category: 'Pro',
    details: 'Largest bass: 26.8 lbs. Strong performance throughout all rounds.'
  },
  {
    tournamentId: '40',
    userId: '1',
    rank: 3,
    score: 24.3,
    scoreType: 'weight',
    categoryRank: 3,
    category: 'Pro',
    details: 'Largest bass: 24.3 lbs. Solid showing in competitive field.'
  },
  {
    tournamentId: '40',
    userId: '103',
    rank: 4,
    score: 23.7,
    scoreType: 'weight',
    categoryRank: 4,
    category: 'Pro',
    details: 'Largest bass: 23.7 lbs. Narrowly missed podium finish.'
  },
  {
    tournamentId: '40',
    userId: '104',
    rank: 5,
    score: 22.9,
    scoreType: 'weight',
    categoryRank: 5,
    category: 'Pro',
    details: 'Largest bass: 22.9 lbs. Top 5 finish in elite competition.'
  },
  {
    tournamentId: '40',
    userId: '105',
    rank: 6,
    score: 22.1,
    scoreType: 'weight',
    categoryRank: 6,
    category: 'Pro',
    details: 'Largest bass: 22.1 lbs. Consistent performance over three days.'
  },
  {
    tournamentId: '40',
    userId: '106',
    rank: 7,
    score: 21.5,
    scoreType: 'weight',
    categoryRank: 7,
    category: 'Pro',
    details: 'Largest bass: 21.5 lbs. Strong finish in challenging conditions.'
  },
  {
    tournamentId: '40',
    userId: '107',
    rank: 8,
    score: 20.8,
    scoreType: 'weight',
    categoryRank: 8,
    category: 'Pro',
    details: 'Largest bass: 20.8 lbs. Top 10 placement.'
  },
  {
    tournamentId: '40',
    userId: '108',
    rank: 9,
    score: 20.2,
    scoreType: 'weight',
    categoryRank: 9,
    category: 'Pro',
    details: 'Largest bass: 20.2 lbs. Respectable performance.'
  },
  {
    tournamentId: '40',
    userId: '109',
    rank: 10,
    score: 19.6,
    scoreType: 'weight',
    categoryRank: 10,
    category: 'Pro',
    details: 'Largest bass: 19.6 lbs. Rounded out top 10.'
  }
];

// Профили атлетов
export const athleteProfiles: AthleteProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://example.com/images/john_doe.jpg',
    country: 'USA',
    totalTournaments: 10,
    wins: 3,
    topThree: 5,
    totalPoints: 500,
    favoritesSports: ['Fishing', 'Sailing']
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://example.com/images/jane_smith.jpg',
    country: 'UK',
    totalTournaments: 8,
    wins: 2,
    topThree: 4,
    totalPoints: 400,
    favoritesSports: ['Wake', 'Jet Ski']
  },
  {
    id: '3',
    name: 'Alex Johnson',
    avatar: 'https://example.com/images/alex_johnson.jpg',
    country: 'Canada',
    totalTournaments: 5,
    wins: 1,
    topThree: 2,
    totalPoints: 300,
    favoritesSports: ['Surf', 'Kayak']
  },
  // Winter Bass Pro Tournament Participants
  {
    id: '101',
    name: 'Brandon Palaniuk',
    country: 'USA',
    totalTournaments: 45,
    wins: 12,
    topThree: 28,
    totalPoints: 2450,
    favoritesSports: ['Fishing']
  },
  {
    id: '102',
    name: 'Jordan Lee',
    country: 'USA',
    totalTournaments: 52,
    wins: 10,
    topThree: 31,
    totalPoints: 2380,
    favoritesSports: ['Fishing']
  },
  {
    id: '103',
    name: 'Scott Martin',
    country: 'USA',
    totalTournaments: 38,
    wins: 8,
    topThree: 22,
    totalPoints: 1920,
    favoritesSports: ['Fishing']
  },
  {
    id: '104',
    name: 'Gerald Swindle',
    country: 'USA',
    totalTournaments: 60,
    wins: 7,
    topThree: 25,
    totalPoints: 2100,
    favoritesSports: ['Fishing']
  },
  {
    id: '105',
    name: 'Mike Iaconelli',
    country: 'USA',
    totalTournaments: 55,
    wins: 9,
    topThree: 27,
    totalPoints: 2250,
    favoritesSports: ['Fishing']
  },
  {
    id: '106',
    name: 'Edwin Evers',
    country: 'USA',
    totalTournaments: 48,
    wins: 6,
    topThree: 21,
    totalPoints: 1850,
    favoritesSports: ['Fishing']
  },
  {
    id: '107',
    name: 'Kevin VanDam',
    country: 'USA',
    totalTournaments: 70,
    wins: 25,
    topThree: 48,
    totalPoints: 3500,
    favoritesSports: ['Fishing']
  },
  {
    id: '108',
    name: 'Skeet Reese',
    country: 'USA',
    totalTournaments: 62,
    wins: 11,
    topThree: 35,
    totalPoints: 2650,
    favoritesSports: ['Fishing']
  },
  {
    id: '109',
    name: 'Brent Ehrler',
    country: 'USA',
    totalTournaments: 42,
    wins: 8,
    topThree: 24,
    totalPoints: 2050,
    favoritesSports: ['Fishing']
  }
];