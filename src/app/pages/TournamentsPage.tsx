import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Users,
  Trophy,
  X
} from 'lucide-react';
import { tournaments } from '../data/mockData';
import type { Tournament, SportType, TournamentStatus } from '../data/mockData';

export function TournamentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'all'>('all');

  const sportTypes: (SportType | 'all')[] = ['all', 'Fishing', 'Sailing', 'Wake', 'Jet Ski', 'Surf', 'Kayak'];
  const statusOptions: (TournamentStatus | 'all')[] = ['all', 'upcoming', 'finished'];

  // Filter tournaments
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || t.sportType === selectedSport;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const getTournamentStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'finished': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-950 text-white pb-24">
      <div className="px-6 pt-16 pb-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">All Tournaments</h1>
          <p className="text-sm text-slate-400 mt-1">Find your next competition</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments..."
              className="w-full rounded-xl bg-slate-900 py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 transition-colors active:bg-slate-800"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-cyan-400" />
              <span className="font-medium">Filters</span>
              {(selectedSport !== 'all' || selectedStatus !== 'all') && (
                <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-xs font-bold text-white">
                  Active
                </span>
              )}
            </div>
            <span className="text-sm text-slate-400">
              {showFilters ? 'Hide' : 'Show'}
            </span>
          </button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="rounded-xl bg-slate-900 p-4 space-y-4 border border-slate-800">
              {/* Sport Type Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Sport Type</label>
                <div className="flex flex-wrap gap-2">
                  {sportTypes.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedSport === sport
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-400 active:bg-slate-700'
                      }`}
                    >
                      {sport === 'all' ? 'All' : sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedStatus === status
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-800 text-slate-400 active:bg-slate-700'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedSport !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedSport('all');
                    setSelectedStatus('all');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2 text-sm font-medium text-slate-400 transition-colors active:bg-slate-700"
                >
                  <X className="size-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-400">
            {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Tournament List */}
        <div className="space-y-3">
          {filteredTournaments.length === 0 ? (
            <div className="rounded-xl bg-slate-900 p-12 text-center border border-slate-800">
              <Trophy className="mx-auto size-12 text-slate-600 mb-3" />
              <h3 className="font-semibold text-white mb-2">No tournaments found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredTournaments.map((tournament) => (
              <button
                key={tournament.id}
                onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/tournaments' } })}
                className="w-full rounded-xl bg-slate-900 p-4 text-left border border-slate-800 transition-colors active:bg-slate-800"
              >
                <div className="flex items-start gap-4">
                  {/* Tournament Image Placeholder */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
                    <Trophy className="size-8 text-cyan-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold border ${getTournamentStatusColor(tournament.status)}`}>
                        {tournament.status.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-400">
                        {tournament.sportType}
                      </span>
                      {tournament.category && (
                        <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-300">
                          {tournament.category}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2 truncate">{tournament.name}</h3>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="size-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(tournament.dateStart)} - {formatDate(tournament.dateEnd)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="size-3 flex-shrink-0" />
                        <span className="truncate">{tournament.location.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users className="size-3 flex-shrink-0" />
                        <span>
                          {tournament.participantsCount}
                          {tournament.maxParticipants ? `/${tournament.maxParticipants}` : ''} participants
                        </span>
                      </div>
                    </div>

                    {tournament.prizePool && (
                      <div className="mt-2 inline-block rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                        ${tournament.prizePool.toLocaleString()} Prize Pool
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}