import { ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TournamentCard } from '../components/TournamentCard';

interface SearchScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function SearchScreen({ onNavigate, onBack }: SearchScreenProps) {
  const { tournaments, setSelectedTournamentId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const quickFilters = [
    'Italy', 'Poland', 'Czech Republic', 'Germany',
    'Feeder', 'Match Fishing', 'Float',
    'Open', 'Upcoming'
  ];

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.discipline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => 
        t.country.includes(filter) || 
        t.discipline.includes(filter) ||
        t.status.includes(filter.toLowerCase())
      );

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleTournamentDetails = (id: number) => {
    setSelectedTournamentId(id);
    onNavigate('tournament-details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Search Tournaments
          </h1>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-xl p-3 flex items-center gap-3">
          <input
            type="text"
            placeholder="Tournament, city, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 font-['Inter',sans-serif] text-sm text-gray-900 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 mt-6">
        <h3 className="font-['Figtree',sans-serif] font-bold text-sm text-gray-900 mb-3">
          Quick Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(filter => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-4 py-2 rounded-full font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                selectedFilters.includes(filter)
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 mt-6 pb-[calc(30px+40px)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
            Results ({filteredTournaments.length})
          </h3>
        </div>

        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-['Inter',sans-serif] text-gray-500">
              No tournaments found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTournaments.map(tournament => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onDetails={handleTournamentDetails}
                onRegister={(id) => {
                  setSelectedTournamentId(id);
                  onNavigate('register');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
