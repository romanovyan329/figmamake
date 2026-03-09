// Official tournament result (published by federation)
export interface TournamentResult {
  position: number;
  athleteName: string;
  federationId?: string;
  country: string;
  team?: string;
  totalWeight: number;
  bigFish?: number;
  day1Weight?: number;
  day2Weight?: number;
  day3Weight?: number;
  day4Weight?: number;
  section?: string;
  peg?: string;
  prize?: string;
  details?: string;
}

export interface Tournament {
  id: number;
  title: string;
  location: string;
  country: string;
  date: string;
  startDate: string;
  endDate: string;
  participants: number;
  discipline: string;
  prize: string;
  status: 'registration' | 'upcoming' | 'in-progress' | 'results-pending' | 'completed' | 'closed';
  format: 'individual' | 'team';
  level?: 'amateur' | 'regional' | 'national' | 'international' | 'championship' | 'pro-series';
  waterBody?: {
    name: string;
    type: string;
    depth: string;
    targetFish: string;
    temperature: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
  };
  description?: string;
  entryFee?: string;
  registrationDeadline?: string;
  resultsPublishedDate?: string; // When official results were published
  officialResults?: TournamentResult[]; // Official leaderboard
}

export interface TournamentFilters {
  countries: string[];
  disciplines: string[];
  levels: string[];
  formats: string[];
  prizeRange: { min: number; max: number };
  dateRange: { start: string | null; end: string | null };
  statuses: string[];
}

export interface TournamentEntry {
  tournamentId: number;
  participationType: 'individual' | 'team';
  team?: string;
  goal?: string;
  notes?: string;
  results?: {
    day1Weight?: number;
    day2Weight?: number;
    day3Weight?: number;
    day4Weight?: number;
    bigFish?: number;
    totalWeight: number;
    finalPosition: number;
    weather?: string;
    details?: string;
    section?: string;
    prize?: string;
    notes?: string;
  };
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  country: string;
  birthDate?: string;
  primaryDiscipline?: string;
  disciplines?: string[];
  competitionType?: 'individual' | 'team';
  yearsOfExperience?: number;
  experience?: string;
  bio?: string;
  photo?: string;
  createdAt?: string;
  federationLicenseId?: string; // Federation ID for linking official results
  federationLicenseStatus?: 'not-linked' | 'pending' | 'verified'; // License verification status
}

export interface Team {
  id: number;
  name: string;
  country: string;
  discipline: string;
  description?: string;
  logo?: string;
  notes?: string;
  status?: 'active' | 'inactive';
  createdAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  fullName: string;
  role: 'captain' | 'angler' | 'coach' | 'support' | 'reserve';
  country?: string;
  dateOfBirth?: string;
  primaryDiscipline?: string;
  photo?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}