import { createContext, useContext, useState, ReactNode } from 'react';
import { Tournament, TournamentEntry, UserProfile, Team, TeamMember } from '../types/tournament';

interface AppContextType {
  tournaments: Tournament[];
  myEntries: TournamentEntry[];
  userProfile: UserProfile | null;
  teams: Team[];
  teamMembers: TeamMember[];
  addToSeason: (entry: TournamentEntry) => void;
  removeFromSeason: (tournamentId: number) => void;
  updateEntry: (tournamentId: number, entry: Partial<TournamentEntry>) => void;
  isInMySeason: (tournamentId: number) => boolean;
  getEntry: (tournamentId: number) => TournamentEntry | undefined;
  selectedTournamentId: number | null;
  setSelectedTournamentId: (id: number | null) => void;
  selectedResultTournamentId: number | null;
  setSelectedResultTournamentId: (id: number | null) => void;
  createProfile: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (teamId: number, team: Partial<Team>) => void;
  deleteTeam: (teamId: number) => void;
  selectedTeamId: number | null;
  setSelectedTeamId: (id: number | null) => void;
  createTeamMember: (teamId: number, member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  updateTeamMember: (memberId: number, member: Partial<TeamMember>) => void;
  deleteTeamMember: (memberId: number) => void;
  getTeamMembers: (teamId: number) => TeamMember[];
  selectedMemberId: number | null;
  setSelectedMemberId: (id: number | null) => void;
  resetToDemo: () => void;
  clearProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockTournaments: Tournament[] = [
  {
    id: 1,
    title: 'European Feeder Championship 2026',
    location: 'Mantua',
    country: 'Italy',
    date: 'May 15-18, 2026',
    startDate: '2026-05-15',
    endDate: '2026-05-18',
    participants: 145,
    discipline: 'Feeder',
    prize: '€50,000',
    status: 'registration',
    format: 'individual',
    level: 'international',
    entryFee: '€350',
    registrationDeadline: '2026-03-15',
    waterBody: {
      name: 'Po River',
      type: 'River',
      depth: '2-6 meters',
      targetFish: 'Bream, Roach',
      temperature: '18-22°C',
      coordinates: { lat: 45.1564, lng: 10.7914 },
      imageUrl: 'https://images.unsplash.com/photo-1728714504375-95a50d07edf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQbyUyMFJpdmVyJTIwSXRhbHklMjBmaXNoaW5nJTIwd2F0ZXJ8ZW58MXx8fHwxNzcyMjA3NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'The European Feeder Championship is one of the most prestigious feeder fishing competitions in Europe.'
  },
  {
    id: 2,
    title: 'Italian Carp Open 2026',
    location: 'Lake Garda',
    country: 'Italy',
    date: 'June 10-13, 2026',
    startDate: '2026-06-10',
    endDate: '2026-06-13',
    participants: 80,
    discipline: 'Carp',
    prize: '€30,000',
    status: 'registration',
    format: 'team',
    level: 'national',
    entryFee: '€500',
    registrationDeadline: '2026-04-20',
    waterBody: {
      name: 'Lake Garda',
      type: 'Lake',
      depth: '10-40 meters',
      targetFish: 'Carp, Tench',
      temperature: '20-24°C',
      coordinates: { lat: 45.6389, lng: 10.7378 },
      imageUrl: 'https://images.unsplash.com/photo-1597645288235-cb548748ed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwR2FyZGElMjBJdGFseSUyMHNjZW5pYyUyMHdhdGVyfGVufDF8fHx8MTc3MjIwNzY0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Elite carp fishing competition on the beautiful waters of Lake Garda.'
  },
  {
    id: 3,
    title: 'Polish Open Match Fishing 2026',
    location: 'Warsaw',
    country: 'Poland',
    date: 'June 3-5, 2026',
    startDate: '2026-06-03',
    endDate: '2026-06-05',
    participants: 98,
    discipline: 'Match Fishing',
    prize: '€25,000',
    status: 'registration',
    format: 'individual',
    level: 'national',
    entryFee: '€250',
    registrationDeadline: '2026-04-30',
    waterBody: {
      name: 'Vistula River',
      type: 'River',
      depth: '3-8 meters',
      targetFish: 'Roach, Bream',
      temperature: '16-20°C',
      coordinates: { lat: 52.2297, lng: 21.0122 },
      imageUrl: 'https://images.unsplash.com/photo-1714661116916-8e44405d0c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaXN0dWxhJTIwUml2ZXIlMjBXYXJzYXclMjBQb2xhbmQlMjB3YXRlcnxlbnwxfHx8fDE3NzIyMDc2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Annual Polish championship attracting top athletes from Central Europe.'
  },
  {
    id: 4,
    title: 'Czech National Feeder Championship 2026',
    location: 'Prague',
    country: 'Czech Republic',
    date: 'July 1-3, 2026',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    participants: 120,
    discipline: 'Feeder',
    prize: '€20,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€200',
    registrationDeadline: '2026-05-15',
    waterBody: {
      name: 'Labe River',
      type: 'River',
      depth: '3-7 meters',
      targetFish: 'Bream, Roach',
      temperature: '18-22°C',
      coordinates: { lat: 50.0755, lng: 14.4378 },
      imageUrl: 'https://images.unsplash.com/photo-1725010967541-9e9e25f36f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWJlJTIwRWxiZSUyMFJpdmVyJTIwUHJhZ3VlJTIwQ3plY2h8ZW58MXx8fHwxNzcyMjA3NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Czech National Championship with competitive field from across Europe.'
  },
  {
    id: 5,
    title: 'German Carp Masters 2026',
    location: 'Berlin',
    country: 'Germany',
    date: 'July 15-18, 2026',
    startDate: '2026-07-15',
    endDate: '2026-07-18',
    participants: 70,
    discipline: 'Carp',
    prize: '€35,000',
    status: 'upcoming',
    format: 'team',
    level: 'national',
    entryFee: '€450',
    registrationDeadline: '2026-05-30',
    waterBody: {
      name: 'Müritz Lake',
      type: 'Lake',
      depth: '5-15 meters',
      targetFish: 'Carp, Pike',
      temperature: '20-24°C',
      coordinates: { lat: 53.4167, lng: 12.6833 },
      imageUrl: 'https://images.unsplash.com/photo-1683041133891-613b76cbebc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHZXJtYW4lMjBsYWtlJTIwd2F0ZXIlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzcyMjA3NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Germany\'s premier carp fishing competition on the largest lake in the country.'
  },
  {
    id: 6,
    title: 'Baltic Match Fishing Cup 2026',
    location: 'Riga',
    country: 'Latvia',
    date: 'August 5-8, 2026',
    startDate: '2026-08-05',
    endDate: '2026-08-08',
    participants: 110,
    discipline: 'Match Fishing',
    prize: '€18,000',
    status: 'upcoming',
    format: 'individual',
    level: 'international',
    entryFee: '€180',
    registrationDeadline: '2026-06-20',
    waterBody: {
      name: 'Daugava River',
      type: 'River',
      depth: '2-5 meters',
      targetFish: 'Bream, Roach',
      temperature: '18-22°C',
      coordinates: { lat: 56.9496, lng: 24.1052 },
      imageUrl: 'https://images.unsplash.com/photo-1638108517447-49ccb003d6f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYXVnYXZhJTIwUml2ZXIlMjBSaWdhJTIwTGF0dmlhJTIwd2F0ZXJ8ZW58MXx8fHwxNzcyMjA3NjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'International match fishing competition in the Baltic region.'
  },
  {
    id: 7,
    title: 'Spanish Feeder Grand Prix 2026',
    location: 'Valencia',
    country: 'Spain',
    date: 'September 10-12, 2026',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    participants: 95,
    discipline: 'Feeder',
    prize: '€22,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€220',
    registrationDeadline: '2026-07-30',
    waterBody: {
      name: 'Júcar River',
      type: 'River',
      depth: '2-6 meters',
      targetFish: 'Carp, Roach',
      temperature: '22-26°C',
      coordinates: { lat: 39.4699, lng: -0.3763 },
      imageUrl: 'https://images.unsplash.com/photo-1634726963559-080b71c08af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKdWNhciUyMFJpdmVyJTIwVmFsZW5jaWElMjBTcGFpbiUyMHdhdGVyfGVufDF8fHx8MTc3MjIwNzY0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Spanish national feeder championship on the scenic Júcar River.'
  },
  {
    id: 8,
    title: 'Dutch Carp Classic 2026',
    location: 'Zwolle',
    country: 'Netherlands',
    date: 'September 20-23, 2026',
    startDate: '2026-09-20',
    endDate: '2026-09-23',
    participants: 60,
    discipline: 'Carp',
    prize: '€28,000',
    status: 'upcoming',
    format: 'team',
    level: 'national',
    entryFee: '€400',
    registrationDeadline: '2026-08-01',
    waterBody: {
      name: 'IJssel Lake',
      type: 'Lake',
      depth: '3-8 meters',
      targetFish: 'Carp, Bream',
      temperature: '16-20°C',
      coordinates: { lat: 52.5125, lng: 6.0917 },
      imageUrl: 'https://images.unsplash.com/photo-1610121071216-fdc89d1dd633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXRoZXJsYW5kcyUyMGxha2UlMjB3YXRlciUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyMDc2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Premier Dutch carp fishing event on IJssel Lake.'
  },
  {
    id: 9,
    title: 'Lake Balaton Match Fishing Festival 2026',
    location: 'Balaton',
    country: 'Hungary',
    date: 'August 25-28, 2026',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    participants: 130,
    discipline: 'Match Fishing',
    prize: '€40,000',
    status: 'upcoming',
    format: 'individual',
    level: 'international',
    entryFee: '€300',
    registrationDeadline: '2026-07-01',
    waterBody: {
      name: 'Lake Balaton',
      type: 'Lake',
      depth: '3-12 meters',
      targetFish: 'Bream, Carp',
      temperature: '22-26°C',
      coordinates: { lat: 46.9073, lng: 17.8933 },
      imageUrl: 'https://images.unsplash.com/photo-1683823954380-545ab839dcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwQmFsYXRvbiUyMEh1bmdhcnklMjB3YXRlciUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyMDc2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Major international match fishing festival on Europe\'s largest lake.'
  },
  {
    id: 10,
    title: 'French National Carp Fishing Championship 2026',
    location: 'Lyon',
    country: 'France',
    date: 'October 1-4, 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-04',
    participants: 85,
    discipline: 'Carp',
    prize: '€32,000',
    status: 'upcoming',
    format: 'team',
    level: 'national',
    entryFee: '€350',
    registrationDeadline: '2026-08-15',
    waterBody: {
      name: 'Rhône River',
      type: 'River',
      depth: '2-7 meters',
      targetFish: 'Carp',
      temperature: '16-20°C',
      coordinates: { lat: 45.7640, lng: 4.8357 },
      imageUrl: 'https://images.unsplash.com/photo-1643119721721-69bc5fc6b941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaG9uZSUyMFJpdmVyJTIwTHlvbiUyMEZyYW5jZSUyMHdhdGVyfGVufDF8fHx8MTc3MjIwNzYwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'French national carp championship on the legendary Rhône River.'
  },
  {
    id: 11,
    title: 'UK Feeder Open 2026',
    location: 'Birmingham',
    country: 'United Kingdom',
    date: 'September 5-8, 2026',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    participants: 75,
    discipline: 'Feeder',
    prize: '€15,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€200',
    registrationDeadline: '2026-07-25',
    waterBody: {
      name: 'River Severn',
      type: 'River',
      depth: '2-5 meters',
      targetFish: 'Roach, Bream',
      temperature: '14-18°C',
      coordinates: { lat: 52.4862, lng: -1.8904 },
      imageUrl: 'https://images.unsplash.com/photo-1565784851056-e34148f6e268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVSyUyMHJpdmVyJTIwd2F0ZXIlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzcyMjA3NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Classic British feeder fishing on the historic River Severn.'
  },
  {
    id: 12,
    title: 'Swedish National Match Cup 2026',
    location: 'Gothenburg',
    country: 'Sweden',
    date: 'August 15-18, 2026',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    participants: 90,
    discipline: 'Match Fishing',
    prize: '€20,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€220',
    registrationDeadline: '2026-06-30',
    waterBody: {
      name: 'Göta älv',
      type: 'River',
      depth: '3-8 meters',
      targetFish: 'Roach, Bream',
      temperature: '16-20°C',
      coordinates: { lat: 57.7089, lng: 11.9746 },
      imageUrl: 'https://images.unsplash.com/photo-1653458295159-3d738297c9d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTd2VkZW4lMjByaXZlciUyMHdhdGVyJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjIwNzY1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Swedish national match fishing championship on the Göta älv river.'
  },
  {
    id: 13,
    title: 'Italian River Feeder Challenge 2026',
    location: 'Bologna',
    country: 'Italy',
    date: 'July 20-22, 2026',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    participants: 50,
    discipline: 'Feeder',
    prize: '€12,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€180',
    registrationDeadline: '2026-06-01',
    waterBody: {
      name: 'Reno River',
      type: 'River',
      depth: '2-5 meters',
      targetFish: 'Roach, Chub',
      temperature: '22-26°C',
      coordinates: { lat: 44.4949, lng: 11.3426 },
      imageUrl: 'https://images.unsplash.com/photo-1759490346141-adc7e4267f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJdGFseSUyMHJpdmVyJTIwd2F0ZXIlMjBsYW5kc2NhcGUlMjBzY2VuaWN8ZW58MXx8fHwxNzcyMjA3NjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Technical feeder fishing challenge on Italian river waters.'
  },
  {
    id: 14,
    title: 'Spain Coastal Match Open 2026',
    location: 'Barcelona',
    country: 'Spain',
    date: 'September 2-4, 2026',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    participants: 65,
    discipline: 'Match Fishing',
    prize: '€20,000',
    status: 'upcoming',
    format: 'individual',
    level: 'national',
    entryFee: '€250',
    registrationDeadline: '2026-07-30',
    waterBody: {
      name: 'Mediterranean Sea',
      type: 'Sea',
      depth: 'Shore fishing',
      targetFish: 'Sea Bream, Bass',
      temperature: '24-28°C',
      coordinates: { lat: 41.3851, lng: 2.1734 },
      imageUrl: 'https://images.unsplash.com/photo-1630770005229-5f3b460b1870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRpdGVycmFuZWFuJTIwU2VhJTIwQmFyY2Vsb25hJTIwY29hc3QlMjBmaXNoaW5nfGVufDF8fHx8MTc3MjIwNzY0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Exciting sea fishing competition on the Mediterranean coast.'
  }
];

// Past tournaments for history
const mockPastTournaments: Tournament[] = [
  {
    id: 101,
    title: 'Polish National Championship 2025',
    location: 'Warsaw',
    country: 'Poland',
    date: 'October 10-12, 2025',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    participants: 120,
    discipline: 'Feeder',
    prize: '€15,000',
    status: 'completed',
    format: 'individual',
    level: 'national',
    entryFee: '€200',
    registrationDeadline: '2025-09-01',
    resultsPublishedDate: 'October 15, 2025',
    waterBody: {
      name: 'Vistula River',
      type: 'River',
      depth: '3-7 meters',
      targetFish: 'Bream, Roach',
      temperature: '12-16°C',
      coordinates: { lat: 52.2297, lng: 21.0122 },
      imageUrl: 'https://images.unsplash.com/photo-1714661116916-8e44405d0c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaXN0dWxhJTIwUml2ZXIlMjBXYXJzYXclMjBQb2xhbmQlMjB3YXRlcnxlbnwxfHx8fDE3NzIyMDc2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Annual Polish National Championship with top domestic anglers.',
    officialResults: [
      { position: 1, athleteName: 'Jan Kowalski', federationId: 'POL-FED-2018-A128', country: 'Poland', totalWeight: 25800, bigFish: 3200, day1Weight: 8900, day2Weight: 8200, day3Weight: 8700, section: 'A', peg: '12', prize: '€5,000' },
      { position: 2, athleteName: 'Piotr Nowak', federationId: 'POL-FED-2019-B045', country: 'Poland', totalWeight: 24200, bigFish: 2900, day1Weight: 8100, day2Weight: 8300, day3Weight: 7800, section: 'B', peg: '8', prize: '€3,000' },
      { position: 3, athleteName: 'Alexander Petrov', federationId: 'POL-FED-2015-A042', country: 'Poland', totalWeight: 23500, bigFish: 3100, day1Weight: 7800, day2Weight: 8200, day3Weight: 7500, section: 'A', peg: '15', prize: '€2,000' },
      { position: 4, athleteName: 'Marek Wiśniewski', federationId: 'POL-FED-2020-C091', country: 'Poland', totalWeight: 22100, bigFish: 2700, day1Weight: 7200, day2Weight: 7600, day3Weight: 7300, section: 'C', peg: '5' },
      { position: 5, athleteName: 'Tomasz Zieliński', federationId: 'POL-FED-2017-D056', country: 'Poland', totalWeight: 21300, bigFish: 2800, day1Weight: 7100, day2Weight: 7400, day3Weight: 6800, section: 'D', peg: '22' },
      { position: 6, athleteName: 'Krzysztof Lewandowski', federationId: 'POL-FED-2021-A087', country: 'Poland', totalWeight: 20500, bigFish: 2600, section: 'B', peg: '18' },
      { position: 7, athleteName: 'Andrzej Dąbrowski', federationId: 'POL-FED-2016-B034', country: 'Poland', totalWeight: 19800, bigFish: 2500, section: 'A', peg: '9' },
      { position: 8, athleteName: 'Paweł Jankowski', federationId: 'POL-FED-2019-C072', country: 'Poland', totalWeight: 19200, bigFish: 2400, section: 'C', peg: '14' },
      { position: 9, athleteName: 'Michał Szymański', federationId: 'POL-FED-2018-D099', country: 'Poland', totalWeight: 18700, bigFish: 2300, section: 'D', peg: '3' },
      { position: 10, athleteName: 'Wojciech Kowalczyk', federationId: 'POL-FED-2020-A015', country: 'Poland', totalWeight: 18100, bigFish: 2200, section: 'A', peg: '21' }
    ]
  },
  {
    id: 102,
    title: 'German Regional Feeder Cup 2025',
    location: 'Munich',
    country: 'Germany',
    date: 'September 5-7, 2025',
    startDate: '2025-09-05',
    endDate: '2025-09-07',
    participants: 80,
    discipline: 'Feeder',
    prize: '€12,000',
    status: 'completed',
    format: 'individual',
    level: 'national',
    entryFee: '€180',
    registrationDeadline: '2025-08-01',
    waterBody: {
      name: 'Isar River',
      type: 'River',
      depth: '2-5 meters',
      targetFish: 'Bream, Roach',
      temperature: '16-20°C',
      coordinates: { lat: 48.1351, lng: 11.5820 },
      imageUrl: 'https://images.unsplash.com/photo-1683041133891-613b76cbebc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHZXJtYW4lMjBsYWtlJTIwd2F0ZXIlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzcyMjA3NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Regional German feeder competition in Bavaria.'
  },
  {
    id: 103,
    title: 'Baltic Cup 2025',
    location: 'Gdansk',
    country: 'Poland',
    date: 'July 15-16, 2025',
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    participants: 60,
    discipline: 'Float',
    prize: '€10,000',
    status: 'completed',
    format: 'team',
    level: 'international',
    entryFee: '€300',
    registrationDeadline: '2025-06-01',
    waterBody: {
      name: 'Baltic Coast Canals',
      type: 'Canal',
      depth: '2-4 meters',
      targetFish: 'Roach, Perch',
      temperature: '18-22°C',
      coordinates: { lat: 54.3520, lng: 18.6466 },
      imageUrl: 'https://images.unsplash.com/photo-1714661116916-8e44405d0c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaXN0dWxhJTIwUml2ZXIlMjBXYXJzYXclMjBQb2xhbmQlMjB3YXRlcnxlbnwxfHx8fDE3NzIyMDc2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'International team tournament on Baltic coast waters.'
  },
  {
    id: 104,
    title: 'Czech Open Qualifier 2025',
    location: 'Brno',
    country: 'Czech Republic',
    date: 'June 20-21, 2025',
    startDate: '2025-06-20',
    endDate: '2025-06-21',
    participants: 100,
    discipline: 'Feeder',
    prize: '€8,000',
    status: 'completed',
    format: 'individual',
    level: 'national',
    entryFee: '€150',
    registrationDeadline: '2025-05-15',
    waterBody: {
      name: 'Brno Reservoir',
      type: 'Lake',
      depth: '3-10 meters',
      targetFish: 'Bream, Carp',
      temperature: '18-22°C',
      coordinates: { lat: 49.1951, lng: 16.6068 },
      imageUrl: 'https://images.unsplash.com/photo-1725010967541-9e9e25f36f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWJlJTIwRWxiZSUyMFJpdmVyJTIwUHJhZ3VlJTIwQ3plY2h8ZW58MXx8fHwxNzcyMjA3NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Qualifier for Czech National Championship.'
  },
  {
    id: 105,
    title: 'European Championship 2025',
    location: 'Brussels',
    country: 'Belgium',
    date: 'May 10-12, 2025',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    participants: 150,
    discipline: 'Feeder',
    prize: '€60,000',
    status: 'completed',
    format: 'individual',
    level: 'international',
    entryFee: '€400',
    registrationDeadline: '2025-03-15',
    waterBody: {
      name: 'Brussels-Charleroi Canal',
      type: 'Canal',
      depth: '3-6 meters',
      targetFish: 'Bream, Roach',
      temperature: '16-20°C',
      coordinates: { lat: 50.8503, lng: 4.3517 },
      imageUrl: 'https://images.unsplash.com/photo-1610121071216-fdc89d1dd633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXRoZXJsYW5kcyUyMGxha2UlMjB3YXRlciUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyMDc2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Major European Championship with top international athletes.'
  },
  {
    id: 106,
    title: 'International Masters 2024',
    location: 'Amsterdam',
    country: 'Netherlands',
    date: 'August 15-17, 2024',
    startDate: '2024-08-15',
    endDate: '2024-08-17',
    participants: 120,
    discipline: 'Feeder',
    prize: '€35,000',
    status: 'completed',
    format: 'individual',
    level: 'international',
    entryFee: '€350',
    registrationDeadline: '2024-07-01',
    waterBody: {
      name: 'Amsterdam-Rhine Canal',
      type: 'Canal',
      depth: '4-8 meters',
      targetFish: 'Bream, Roach',
      temperature: '20-24°C',
      coordinates: { lat: 52.3676, lng: 4.9041 },
      imageUrl: 'https://images.unsplash.com/photo-1610121071216-fdc89d1dd633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXRoZXJsYW5kcyUyMGxha2UlMjB3YXRlciUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyMDc2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Elite international masters competition in the Netherlands.'
  },
  {
    id: 107,
    title: 'National Feeder Trophy 2024',
    location: 'Krakow',
    country: 'Poland',
    date: 'July 5-7, 2024',
    startDate: '2024-07-05',
    endDate: '2024-07-07',
    participants: 90,
    discipline: 'Feeder',
    prize: '€18,000',
    status: 'completed',
    format: 'individual',
    level: 'national',
    entryFee: '€220',
    registrationDeadline: '2024-05-20',
    waterBody: {
      name: 'Vistula River',
      type: 'River',
      depth: '2-6 meters',
      targetFish: 'Bream, Roach',
      temperature: '20-24°C',
      coordinates: { lat: 50.0647, lng: 19.9450 },
      imageUrl: 'https://images.unsplash.com/photo-1714661116916-8e44405d0c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaXN0dWxhJTIwUml2ZXIlMjBXYXJzYXclMjBQb2xhbmQlMjB3YXRlcnxlbnwxfHx8fDE3NzIyMDc2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Polish National Feeder Trophy - prestigious annual event.'
  },
  {
    id: 108,
    title: 'Czech Masters 2024',
    location: 'Prague',
    country: 'Czech Republic',
    date: 'June 10-12, 2024',
    startDate: '2024-06-10',
    endDate: '2024-06-12',
    participants: 70,
    discipline: 'Feeder',
    prize: '€16,000',
    status: 'completed',
    format: 'team',
    level: 'national',
    entryFee: '€280',
    registrationDeadline: '2024-04-30',
    waterBody: {
      name: 'Labe River',
      type: 'River',
      depth: '3-7 meters',
      targetFish: 'Bream, Roach',
      temperature: '18-22°C',
      coordinates: { lat: 50.0755, lng: 14.4378 },
      imageUrl: 'https://images.unsplash.com/photo-1725010967541-9e9e25f36f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYWJlJTIwRWxiZSUyMFJpdmVyJTIwUHJhZ3VlJTIwQ3plY2h8ZW58MXx8fHwxNzcyMjA3NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    description: 'Czech Masters team championship on the Labe River.'
  }
];

const mockUserProfile: UserProfile = {
  firstName: 'Alexander',
  lastName: 'Petrov',
  country: 'Poland',
  birthDate: '1992-04-15',
  disciplines: ['Feeder', 'Match Fishing', 'Float'],
  experience: '12 years',
  bio: 'Professional feeder angler with 12 years of competitive experience. Multiple national championships and European podium finishes. Specialized in technical river fishing and precision feeder tactics. Former Polish National Team member with over 80 international competitions.',
  federationLicenseId: 'POL-FED-2015-A042', // Federation License ID for linking official results
  federationLicenseStatus: 'verified' // Verification status
};

const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Baltic Warriors',
    country: 'Poland',
    discipline: 'Float',
    createdAt: '2023-01-15T10:00:00Z',
    notes: 'Baltic Cup 2024 - 2nd Place, Regional Championship 2025 - Winners'
  },
  {
    id: 2,
    name: 'Central Europe United',
    country: 'Czech Republic',
    discipline: 'Feeder',
    createdAt: '2024-03-20T10:00:00Z',
    notes: 'Czech Masters 2025 - 3rd Place'
  }
];

const mockTeamMembers: TeamMember[] = [
  // Baltic Warriors members
  {
    id: 1,
    teamId: 1,
    fullName: 'Alexander Petrov',
    role: 'captain',
    country: 'Poland',
    primaryDiscipline: 'Float',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    notes: 'Team founder and captain. Excellent tactical skills.'
  },
  {
    id: 2,
    teamId: 1,
    fullName: 'Jan Kowalski',
    role: 'angler',
    country: 'Poland',
    primaryDiscipline: 'Float',
    status: 'active',
    createdAt: '2023-01-15T10:30:00Z',
    notes: 'Strong in river conditions'
  },
  {
    id: 3,
    teamId: 1,
    fullName: 'Marek Nowak',
    role: 'angler',
    country: 'Poland',
    primaryDiscipline: 'Float',
    status: 'active',
    createdAt: '2023-01-15T11:00:00Z',
    notes: 'Specialist in canal fishing'
  },
  // Central Europe United members
  {
    id: 4,
    teamId: 2,
    fullName: 'Alexander Petrov',
    role: 'captain',
    country: 'Poland',
    primaryDiscipline: 'Feeder',
    status: 'active',
    createdAt: '2024-03-20T10:00:00Z',
    notes: 'Team captain and main strategist'
  },
  {
    id: 5,
    teamId: 2,
    fullName: 'Pavel Novak',
    role: 'angler',
    country: 'Czech Republic',
    primaryDiscipline: 'Feeder',
    status: 'active',
    createdAt: '2024-03-20T10:30:00Z',
    notes: 'Expert in method feeder tactics'
  },
  {
    id: 6,
    teamId: 2,
    fullName: 'Martin Svoboda',
    role: 'angler',
    country: 'Czech Republic',
    primaryDiscipline: 'Feeder',
    status: 'active',
    createdAt: '2024-03-20T11:00:00Z',
    notes: 'Strong finisher, great under pressure'
  },
  {
    id: 7,
    teamId: 2,
    fullName: 'Jakub Dvorak',
    role: 'reserve',
    country: 'Czech Republic',
    primaryDiscipline: 'Feeder',
    status: 'active',
    createdAt: '2024-03-20T11:30:00Z',
    notes: 'Young talent, very promising'
  }
];

const mockEntries: TournamentEntry[] = [
  {
    tournamentId: 4, // Czech Masters - upcoming
    participationType: 'individual',
    goal: 'Top 10 finish',
    notes: 'Need to practice in cold water conditions. Focus on short feeder tactics.',
    results: undefined
  },
  {
    tournamentId: 1, // European Feeder Championship - registered
    participationType: 'individual',
    goal: 'Podium finish',
    notes: 'Main event of the season. Prepared special bait mix for Italian waters.',
    results: undefined
  },
  {
    tournamentId: 3, // Baltic Cup - team event
    participationType: 'team',
    team: 'Baltic Warriors',
    goal: 'Win the tournament',
    notes: 'Strong team, good chemistry. We know these waters well.',
    results: undefined
  },
  {
    tournamentId: 7, // Spanish Carpfishing Masters
    participationType: 'team',
    team: 'Central Europe United',
    goal: 'Top 5 team finish',
    notes: 'First carp tournament with this team. Excited to learn new tactics.',
    results: undefined
  },
  // Completed tournaments with results
  {
    tournamentId: 101, // Mock past tournament
    participationType: 'individual',
    goal: 'Top 15',
    notes: 'Polish National Championship 2025',
    results: {
      finalPosition: 8,
      totalWeight: 18450,
      day1Weight: 6200,
      day2Weight: 5800,
      day3Weight: 6450,
      bigFish: 2340,
      details: 'Excellent performance in difficult conditions. Strong finish in final round.',
      section: 'Section A, Peg 45',
      prize: '€800',
      weather: 'Cloudy, light rain on day 2'
    }
  },
  {
    tournamentId: 102,
    participationType: 'individual',
    goal: 'Win',
    notes: 'German Regional Feeder Cup 2025',
    results: {
      finalPosition: 3,
      totalWeight: 22100,
      day1Weight: 8300,
      day2Weight: 6800,
      day3Weight: 7000,
      bigFish: 3100,
      details: 'Podium finish! Great tactics with pellet feeder. Lost some time on day 2 but recovered well.',
      section: 'Section B, Peg 12',
      prize: '€2,500',
      weather: 'Sunny, warm conditions'
    }
  },
  {
    tournamentId: 103,
    participationType: 'team',
    team: 'Baltic Warriors',
    goal: 'Podium',
    notes: 'Baltic Cup 2025',
    results: {
      finalPosition: 2,
      totalWeight: 45600,
      day1Weight: 22800,
      day2Weight: 22800,
      bigFish: 2800,
      details: 'Silver medal! Team worked perfectly together. Just 2kg behind winners.',
      section: 'Team Zone 1',
      prize: '€3,000',
      weather: 'Variable winds, challenging conditions'
    }
  },
  {
    tournamentId: 104,
    participationType: 'individual',
    goal: 'Qualification',
    notes: 'Czech Open Qualifier 2025',
    results: {
      finalPosition: 12,
      totalWeight: 15300,
      day1Weight: 8100,
      day2Weight: 7200,
      bigFish: 1900,
      details: 'Qualified for main event. Struggled with changing weather.',
      section: 'Section C, Peg 28',
      prize: '€300',
      weather: 'Cold, windy'
    }
  },
  {
    tournamentId: 105,
    participationType: 'individual',
    goal: 'Top 20',
    notes: 'European Championship 2025',
    results: {
      finalPosition: 15,
      totalWeight: 31200,
      day1Weight: 10400,
      day2Weight: 10200,
      day3Weight: 10600,
      bigFish: 4100,
      details: 'Best European Championship result! Consistent across all rounds.',
      section: 'Zone 2, Peg 67',
      prize: '€1,200',
      weather: 'Perfect conditions all three days'
    }
  },
  {
    tournamentId: 106,
    participationType: 'individual',
    goal: 'Experience',
    notes: 'International Masters 2024',
    results: {
      finalPosition: 28,
      totalWeight: 12800,
      day1Weight: 6800,
      day2Weight: 6000,
      bigFish: 1650,
      details: 'Tough competition. Learned a lot from top athletes.',
      section: 'Section D, Peg 89',
      prize: '€0',
      weather: 'Hot, difficult fishing'
    }
  },
  {
    tournamentId: 107,
    participationType: 'individual',
    goal: 'Win',
    notes: 'National Feeder Trophy 2024',
    results: {
      finalPosition: 1,
      totalWeight: 28900,
      day1Weight: 9800,
      day2Weight: 9100,
      day3Weight: 10000,
      bigFish: 3800,
      details: 'CHAMPION! Perfect execution of tactics. Big bream in final hour sealed the victory!',
      section: 'Section A, Peg 15',
      prize: '€5,000',
      weather: 'Stable conditions, ideal for feeder'
    }
  },
  {
    tournamentId: 108,
    participationType: 'team',
    team: 'Central Europe United',
    goal: 'Top 10',
    notes: 'Czech Masters 2024',
    results: {
      finalPosition: 7,
      totalWeight: 38400,
      day1Weight: 18600,
      day2Weight: 19800,
      bigFish: 2200,
      details: 'Good team debut. Solid middle of the pack finish.',
      section: 'Team Zone 3',
      prize: '€600',
      weather: 'Stable conditions, ideal for feeder'
    }
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [myEntries, setMyEntries] = useState<TournamentEntry[]>(mockEntries);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [selectedResultTournamentId, setSelectedResultTournamentId] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockUserProfile);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const addToSeason = (entry: TournamentEntry) => {
    setMyEntries(prev => [...prev, entry]);
  };

  const removeFromSeason = (tournamentId: number) => {
    setMyEntries(prev => prev.filter(e => e.tournamentId !== tournamentId));
  };

  const updateEntry = (tournamentId: number, updates: Partial<TournamentEntry>) => {
    setMyEntries(prev => prev.map(entry => 
      entry.tournamentId === tournamentId 
        ? { ...entry, ...updates }
        : entry
    ));
  };

  const isInMySeason = (tournamentId: number) => {
    return myEntries.some(e => e.tournamentId === tournamentId);
  };

  const getEntry = (tournamentId: number) => {
    return myEntries.find(e => e.tournamentId === tournamentId);
  };

  const createProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const createTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam = { ...team, id: Date.now(), createdAt: new Date().toISOString() };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (teamId: number, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  const deleteTeam = (teamId: number) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const createTeamMember = (teamId: number, member: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember = { ...member, id: Date.now(), teamId, createdAt: new Date().toISOString() };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (memberId: number, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  const deleteTeamMember = (memberId: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const getTeamMembers = (teamId: number) => {
    return teamMembers.filter(member => member.teamId === teamId);
  };

  const resetToDemo = () => {
    setMyEntries(mockEntries);
    setSelectedTournamentId(null);
    setSelectedResultTournamentId(null);
    setUserProfile(mockUserProfile);
    setTeams(mockTeams);
    setTeamMembers(mockTeamMembers);
    setSelectedTeamId(null);
    setSelectedMemberId(null);
  };

  const clearProfile = () => {
    setUserProfile(null);
  };

  return (
    <AppContext.Provider value={{
      tournaments: [...mockTournaments, ...mockPastTournaments],
      myEntries,
      addToSeason,
      removeFromSeason,
      updateEntry,
      isInMySeason,
      getEntry,
      selectedTournamentId,
      setSelectedTournamentId,
      selectedResultTournamentId,
      setSelectedResultTournamentId,
      userProfile,
      createProfile,
      updateProfile,
      teams,
      createTeam,
      updateTeam,
      deleteTeam,
      selectedTeamId,
      setSelectedTeamId,
      teamMembers,
      createTeamMember,
      updateTeamMember,
      deleteTeamMember,
      getTeamMembers,
      selectedMemberId,
      setSelectedMemberId,
      resetToDemo,
      clearProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}