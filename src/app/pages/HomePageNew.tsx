import { useNavigate } from 'react-router';
import { 
  Trophy,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  Radio
} from 'lucide-react';
import { tournaments, userTournaments, athleteProfiles } from '../data/mockData';
import type { Tournament } from '../data/mockData';

export function HomePageNew() {
  const navigate = useNavigate();
  
  // Current user ID (в реальном приложении из auth context)
  const currentUserId = '1';
  
  // Get user's registered tournaments
  const myTournaments = userTournaments
    .filter(ut => ut.userId === currentUserId && ut.status === 'registered')
    .map(ut => tournaments.find(t => t.id === ut.tournamentId))
    .filter(Boolean) as Tournament[];
  
  // Get upcoming tournament
  const upcomingTournament = myTournaments[0];
  
  // Get nearby tournaments (all upcoming for now)
  const nearbyTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 3);
  
  // Get live tournaments
  const liveTournaments = tournaments.filter(t => t.status === 'live');
  
  // User stats
  const userProfile = athleteProfiles.find(a => a.id === currentUserId) || {
    totalTournaments: 0,
    wins: 0,
    topThree: 0,
  };

  const getTournamentStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-cyan-500/20 text-cyan-400';
      case 'live': return 'bg-red-500/20 text-red-400 animate-pulse';
      case 'finished': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-950 text-white pb-24">
      <div className="space-y-6 px-6 pt-16 pb-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-sm text-slate-400 mt-1">Your water sports journey</p>
        </div>

        {/* Hero Block - Upcoming Tournament */}
        {upcomingTournament ? (
          <div 
            onClick={() => navigate(`/tournaments/${upcomingTournament.id}`, { state: { from: '/' } })}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="size-5 text-cyan-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Next Tournament</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getTournamentStatusColor(upcomingTournament.status)}`}>
                  {upcomingTournament.status.toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-4">{upcomingTournament.name}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="size-4 text-cyan-400" />
                  <span>{formatDate(upcomingTournament.dateStart)} - {formatDate(upcomingTournament.dateEnd)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="size-4 text-cyan-400" />
                  <span>{upcomingTournament.location.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users className="size-4 text-cyan-400" />
                  <span>{upcomingTournament.participantsCount} participants</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
                <span className="text-sm text-cyan-400">View Details</span>
                <ChevronRight className="size-5 text-cyan-400" />
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/tournaments')}
            className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 text-center transition-colors active:bg-slate-800/50"
          >
            <Trophy className="mx-auto size-12 text-slate-600 mb-3" />
            <h3 className="font-semibold text-white mb-2">No Upcoming Tournaments</h3>
            <p className="text-sm text-slate-400 mb-4">Find and register for tournaments near you</p>
            <button className="rounded-xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-white transition-colors active:bg-cyan-600">
              Browse Tournaments
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-900 p-4 text-center border border-slate-800">
            <div className="text-2xl font-bold text-cyan-400">{userProfile.totalTournaments}</div>
            <div className="text-xs text-slate-400 mt-1">Total</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center border border-slate-800">
            <div className="text-2xl font-bold text-yellow-400">{userProfile.wins}</div>
            <div className="text-xs text-slate-400 mt-1">Wins</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center border border-slate-800">
            <div className="text-2xl font-bold text-orange-400">{userProfile.topThree}</div>
            <div className="text-xs text-slate-400 mt-1">Top 3</div>
          </div>
        </div>

        {/* Live Now */}
        {liveTournaments.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="size-5 text-red-400 animate-pulse" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">Live Now</h2>
              </div>
              <button 
                onClick={() => navigate('/tournaments')}
                className="text-sm text-cyan-400"
              >
                See All
              </button>
            </div>
            
            <div className="space-y-3">
              {liveTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/' } })}
                  className="w-full rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 p-4 text-left transition-colors active:bg-red-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
                          LIVE
                        </span>
                        <span className="text-xs text-slate-400">{tournament.sportType}</span>
                      </div>
                      <div className="font-semibold text-white mb-2">{tournament.name}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="size-3" />
                        <span>{tournament.location.name}</span>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-500 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* My Season */}
        {myTournaments.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="size-5 text-cyan-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">My Season</h2>
              </div>
              <button 
                onClick={() => navigate('/season')}
                className="text-sm text-cyan-400"
              >
                See All
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              {myTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/' } })}
                  className="flex-shrink-0 w-64 rounded-xl bg-slate-900 p-4 text-left border border-slate-800 transition-colors active:bg-slate-800"
                >
                  <div className="mb-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getTournamentStatusColor(tournament.status)}`}>
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-semibold text-white mb-3">{tournament.name}</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="size-3" />
                      <span>{formatDate(tournament.dateStart)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="size-3" />
                      <span>{tournament.location.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Tournaments */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-cyan-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Nearby Tournaments</h2>
            </div>
            <button 
              onClick={() => navigate('/tournaments')}
              className="text-sm text-cyan-400"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-3">
            {nearbyTournaments.map((tournament) => (
              <button
                key={tournament.id}
                onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/' } })}
                className="w-full rounded-xl bg-slate-900 p-4 text-left border border-slate-800 transition-colors active:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-400">
                        {tournament.sportType}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        {tournament.participantsCount}/{tournament.maxParticipants} joined
                      </span>
                    </div>
                    <div className="font-semibold text-white mb-2">{tournament.name}</div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>{formatDate(tournament.dateStart)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{tournament.location.name}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-500 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}