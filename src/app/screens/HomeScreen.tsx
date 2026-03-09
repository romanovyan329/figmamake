import { Search, Filter, X, UserPlus } from 'lucide-react';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { BottomNav } from '../components/BottomNav';
import { TournamentCard } from '../components/TournamentCard';
import { useApp } from '../context/AppContext';
import { TournamentFilters } from '../types/tournament';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen = forwardRef<{ applyFilters: (filters: TournamentFilters) => void }, HomeScreenProps>(
  ({ onNavigate }, ref) => {
    const { tournaments, setSelectedTournamentId, myEntries, userProfile } = useApp();
    const [activeFilters, setActiveFilters] = useState<TournamentFilters | null>(null);

    useImperativeHandle(ref, () => ({
      applyFilters: (filters: TournamentFilters) => {
        setActiveFilters(filters);
      }
    }));

    const handleTournamentDetails = (id: number) => {
      setSelectedTournamentId(id);
      onNavigate('tournament-details');
    };

    const handleRegister = (id: number) => {
      setSelectedTournamentId(id);
      onNavigate('register');
    };

    const clearFilter = (type: 'country' | 'discipline' | 'level' | 'format' | 'status', value: string) => {
      if (!activeFilters) return;
      
      const newFilters = { ...activeFilters };
      switch (type) {
        case 'country':
          newFilters.countries = newFilters.countries.filter(c => c !== value);
          break;
        case 'discipline':
          newFilters.disciplines = newFilters.disciplines.filter(d => d !== value);
          break;
        case 'level':
          newFilters.levels = newFilters.levels.filter(l => l !== value);
          break;
        case 'format':
          newFilters.formats = newFilters.formats.filter(f => f !== value);
          break;
        case 'status':
          newFilters.statuses = newFilters.statuses.filter(s => s !== value);
          break;
      }
      setActiveFilters(newFilters);
    };

    const clearAllFilters = () => {
      setActiveFilters(null);
    };

    // Apply filters to tournaments
    const filteredTournaments = activeFilters ? tournaments.filter(t => {
      if (activeFilters.countries.length > 0 && !activeFilters.countries.includes(t.country)) {
        return false;
      }
      if (activeFilters.disciplines.length > 0 && !activeFilters.disciplines.includes(t.discipline)) {
        return false;
      }
      if (activeFilters.levels.length > 0 && t.level) {
        const levelMatch = activeFilters.levels.some(l => 
          l.toLowerCase().replace(' ', '-') === t.level
        );
        if (!levelMatch) return false;
      }
      if (activeFilters.formats.length > 0) {
        const formatMatch = activeFilters.formats.some(f => 
          f.toLowerCase() === t.format
        );
        if (!formatMatch) return false;
      }
      if (activeFilters.statuses.length > 0) {
        const statusMap: Record<string, string> = {
          'Registration Open': 'registration',
          'Upcoming': 'upcoming',
          'Closed': 'closed'
        };
        const statusMatch = activeFilters.statuses.some(s => 
          statusMap[s] === t.status
        );
        if (!statusMatch) return false;
      }
      const prizeValue = parseInt(t.prize.replace(/[€,]/g, ''));
      if (prizeValue < activeFilters.prizeRange.min || prizeValue > activeFilters.prizeRange.max) {
        return false;
      }
      return true;
    }) : tournaments;

    const hasActiveFilters = activeFilters && (
      activeFilters.countries.length > 0 ||
      activeFilters.disciplines.length > 0 ||
      activeFilters.levels.length > 0 ||
      activeFilters.formats.length > 0 ||
      activeFilters.statuses.length > 0 ||
      activeFilters.prizeRange.min > 0 ||
      activeFilters.prizeRange.max < 50000
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
        {/* Header */}
        <div className="bg-[#207DF0] text-white px-6 pt-[calc(60px+24px)] pb-8 rounded-b-3xl">
          <h1 className="font-['Inter',sans-serif] font-black text-2xl mb-2">
            Tournament Navigator
          </h1>
          <p className="font-['Inter',sans-serif] text-sm opacity-90 mb-0">
            Discover and track European competitions
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-6 -mt-6 mb-4">
          <div 
            onClick={() => onNavigate('search')}
            className="bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 cursor-pointer"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-['Inter',sans-serif] text-sm text-gray-400">
              Search tournaments, locations...
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('filter');
              }}
              className="p-2 bg-[#207DF0] rounded-lg"
            >
              <Filter className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* No Profile Banner */}
        {!userProfile && (
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-[#F0A720] to-[#F0A720]/80 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Figtree',sans-serif] font-bold text-white mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="font-['Inter',sans-serif] text-sm text-white/90 mb-3">
                    Create your athlete profile to register for tournaments and track your career progress
                  </p>
                  <button
                    onClick={() => onNavigate('create-profile')}
                    className="px-4 py-2 bg-white text-[#F0A720] rounded-lg font-['Figtree',sans-serif] font-bold text-sm"
                  >
                    Create Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600 font-semibold">
                Active Filters:
              </span>
              <button 
                onClick={clearAllFilters}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters?.countries.map(country => (
                <button
                  key={country}
                  onClick={() => clearFilter('country', country)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#207DF0] text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold"
                >
                  {country}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters?.disciplines.map(disc => (
                <button
                  key={disc}
                  onClick={() => clearFilter('discipline', disc)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F0A720] text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold"
                >
                  {disc}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters?.levels.map(level => (
                <button
                  key={level}
                  onClick={() => clearFilter('level', level)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3F6692] text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold"
                >
                  {level}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters?.formats.map(format => (
                <button
                  key={format}
                  onClick={() => clearFilter('format', format)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold"
                >
                  {format}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters?.statuses.map(status => (
                <button
                  key={status}
                  onClick={() => clearFilter('status', status)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold"
                >
                  {status}
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters && (activeFilters.prizeRange.min > 0 || activeFilters.prizeRange.max < 50000) && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-full font-['Inter',sans-serif] text-xs font-semibold">
                  €{activeFilters.prizeRange.min.toLocaleString()} - €{activeFilters.prizeRange.max.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="font-['Figtree',sans-serif] font-bold text-xl text-[#207DF0]">
                {filteredTournaments.length}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600 mt-1">
                {hasActiveFilters ? 'Filtered' : 'Total Events'}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="font-['Figtree',sans-serif] font-bold text-xl text-[#F0A720]">
                {myEntries.length}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600 mt-1">
                My Season
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <div className="font-['Figtree',sans-serif] font-bold text-xl text-[#3F6692]">
                {new Set(filteredTournaments.map(t => t.country)).size}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600 mt-1">
                Countries
              </div>
            </div>
          </div>
        </div>

        {/* Tournaments List */}
        <div className="px-4 pb-[calc(30px+80px)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              {hasActiveFilters ? 'Filtered Tournaments' : 'Upcoming Tournaments'}
            </h2>
          </div>

          <div className="space-y-4">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onDetails={() => handleTournamentDetails(tournament.id)}
                onRegister={() => handleRegister(tournament.id)}
              />
            ))}
            
            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <p className="font-['Inter',sans-serif] text-gray-600 mb-4">
                  No tournaments match your filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#207DF0] text-white rounded-xl font-['Figtree',sans-serif] font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <BottomNav active="home" onNavigate={onNavigate} />
      </div>
    );
  }
);

HomeScreen.displayName = 'HomeScreen';