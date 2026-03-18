import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Trophy,
  Calendar,
  MapPin,
  TrendingUp,
  Award,
  Target,
  ChevronRight
} from 'lucide-react';
import { tournaments, userTournaments, athleteProfiles } from '../data/mockData';
import type { Tournament } from '../data/mockData';

export function MySeasonPage() {
  const navigate = useNavigate();
  const currentUserId = '1';
  
  // Load tournaments from localStorage + default data
  const [registeredTournaments, setRegisteredTournaments] = useState<Tournament[]>([]);

  const loadTournaments = () => {
    const savedTournaments = localStorage.getItem('userTournaments');
    // Load from localStorage or use default mock data
    const allUserTournaments = savedTournaments ? JSON.parse(savedTournaments) : userTournaments;
    
    const myTournamentIds = allUserTournaments
      .filter((ut: any) => ut.userId === currentUserId && ut.status === 'registered')
      .map((ut: any) => ut.tournamentId);
    
    const myTournaments = tournaments.filter(t => myTournamentIds.includes(t.id));
    setRegisteredTournaments(myTournaments);
  };

  useEffect(() => {
    // Load tournaments on mount and when returning to page
    loadTournaments();
  }, []);

  useEffect(() => {
    // Reload data when window gains focus (user returns to tab/app)
    const handleFocus = () => loadTournaments();
    window.addEventListener('focus', handleFocus);
    
    // Reload data when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTournaments();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load user stats from localStorage
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userSeasonStats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load season stats:', e);
      }
    }
    // Load default stats from athleteProfiles
    const userProfile = athleteProfiles.find(a => a.id === currentUserId);
    return userProfile ? {
      totalTournaments: userProfile.totalTournaments,
      wins: userProfile.wins,
      topThree: userProfile.topThree,
      totalPoints: userProfile.totalPoints
    } : {
      totalTournaments: 0,
      wins: 0,
      topThree: 0,
      totalPoints: 0
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSeasonStats', JSON.stringify(userStats));
  }, [userStats]);

  // Separate upcoming and completed
  const upcomingTournaments = registeredTournaments.filter(t => t.status === 'upcoming' || t.status === 'live');
  const completedTournaments = registeredTournaments.filter(t => t.status === 'finished');

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
      <div className="px-6 pt-16 pb-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Season</h1>
          <p className="text-sm text-slate-400 mt-1">Track your tournament journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="size-5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400">Participated</span>
            </div>
            <div className="text-3xl font-bold text-white">{registeredTournaments.length}</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="size-5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">Wins</span>
            </div>
            <div className="text-3xl font-bold text-white">{userStats.wins}</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="size-5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">Top 3</span>
            </div>
            <div className="text-3xl font-bold text-white">{userStats.topThree}</div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">Points</span>
            </div>
            <div className="text-3xl font-bold text-white">{userStats.totalPoints}</div>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Upcoming ({upcomingTournaments.length})
            </h2>
          </div>

          {upcomingTournaments.length === 0 ? (
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 text-center">
              <Calendar className="mx-auto size-12 text-slate-600 mb-3" />
              <h3 className="font-semibold text-white mb-2">No upcoming tournaments</h3>
              <p className="text-sm text-slate-400 mb-4">Register for a tournament to see it here</p>
              <button
                onClick={() => navigate('/tournaments')}
                className="rounded-xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-white transition-colors active:bg-cyan-600"
              >
                Browse Tournaments
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/season' } })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4 text-left transition-colors active:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getTournamentStatusColor(tournament.status)}`}>
                          {tournament.status.toUpperCase()}
                        </span>
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                          {tournament.sportType}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-white mb-3">{tournament.name}</h3>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="size-4" />
                          <span>{formatDate(tournament.dateStart)} - {formatDate(tournament.dateEnd)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="size-4" />
                          <span>{tournament.location.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="size-5 text-slate-500 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tournaments */}
        {completedTournaments.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Completed ({completedTournaments.length})
              </h2>
            </div>

            <div className="space-y-3">
              {completedTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/season' } })}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4 text-left transition-colors active:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getTournamentStatusColor(tournament.status)}`}>
                          FINISHED
                        </span>
                        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                          {tournament.sportType}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-white mb-3">{tournament.name}</h3>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="size-4" />
                          <span>{formatDate(tournament.dateStart)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="size-4" />
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
        )}
      </div>
    </div>
  );
}