import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Users,
  FileText,
  Map,
  Cloud,
  DollarSign,
  Award,
  User
} from 'lucide-react';
import { tournaments, userTournaments, athleteProfiles, tournamentResults } from '../data/mockData';

export function TournamentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = '1';
  
  const tournament = tournaments.find(t => t.id === id);
  const [isRegistered, setIsRegistered] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Check registration status from localStorage
  useEffect(() => {
    const checkRegistrationStatus = () => {
      const savedTournaments = localStorage.getItem('userTournaments');
      const currentTournaments = savedTournaments ? JSON.parse(savedTournaments) : userTournaments;
      const registered = currentTournaments.some(
        (ut: any) => ut.tournamentId === id && ut.userId === currentUserId && ut.status === 'registered'
      );
      setIsRegistered(registered);
    };

    checkRegistrationStatus();

    // Listen for changes when user returns to the page
    const handleFocus = () => checkRegistrationStatus();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [id, currentUserId]);

  const handleBack = () => {
    // Try to go back to the previous page from location state, or default to /tournaments
    const from = location.state?.from || '/tournaments';
    navigate(from);
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="mx-auto size-12 text-slate-600 mb-3" />
          <p className="text-slate-400">Tournament not found</p>
        </div>
      </div>
    );
  }

  // Get participants (mock data - in real app would fetch from API)
  const participants = athleteProfiles.slice(0, tournament.participantsCount);
  
  // Get results if tournament is finished
  const results = tournamentResults.filter(r => r.tournamentId === id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTournamentStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'live': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'finished': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleRegister = () => {
    // Update localStorage
    const savedTournaments = localStorage.getItem('userTournaments');
    const currentTournaments = savedTournaments ? JSON.parse(savedTournaments) : [...userTournaments];
    
    if (!isRegistered) {
      // Add tournament to season
      currentTournaments.push({
        userId: currentUserId,
        tournamentId: id,
        status: 'registered',
        registeredAt: new Date().toISOString()
      });
      setIsRegistered(true);
    } else {
      // Remove tournament from season
      const index = currentTournaments.findIndex(
        (ut: any) => ut.tournamentId === id && ut.userId === currentUserId
      );
      if (index !== -1) {
        currentTournaments.splice(index, 1);
      }
      setIsRegistered(false);
    }
    
    localStorage.setItem('userTournaments', JSON.stringify(currentTournaments));
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-950 text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-6 py-4 pt-16 backdrop-blur">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-cyan-400 transition-colors active:text-cyan-300"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {/* Hero Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold border ${getTournamentStatusColor(tournament.status)}`}>
              {tournament.status.toUpperCase()}
            </span>
            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
              {tournament.sportType}
            </span>
            {tournament.category && (
              <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                {tournament.category}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">{tournament.name}</h1>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="size-5 text-cyan-400 flex-shrink-0" />
              <span>{formatDate(tournament.dateStart)} - {formatDate(tournament.dateEnd)}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="size-5 text-cyan-400 flex-shrink-0" />
              <span>{tournament.location.name}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Users className="size-5 text-cyan-400 flex-shrink-0" />
              <span>
                {tournament.participantsCount}
                {tournament.maxParticipants ? `/${tournament.maxParticipants}` : ''} participants
              </span>
            </div>
            {tournament.organizerName && (
              <div className="flex items-center gap-3 text-slate-300">
                <Award className="size-5 text-cyan-400 flex-shrink-0" />
                <span>Organized by {tournament.organizerName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prize & Entry Fee */}
        {(tournament.prizePool || tournament.entryFee !== undefined) && (
          <div className="grid grid-cols-2 gap-3">
            {tournament.prizePool && (
              <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="size-4 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">Prize Pool</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white break-words">${tournament.prizePool.toLocaleString()}</div>
              </div>
            )}
            {tournament.entryFee !== undefined && (
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400">Entry Fee</span>
                </div>
                {tournament.entryFee === 0 ? (
                  <div className="text-lg sm:text-2xl font-bold text-emerald-400">Free Entry</div>
                ) : (
                  <div className="text-lg sm:text-2xl font-bold text-white break-words">${tournament.entryFee}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Overview */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-5 text-cyan-400" />
            <h2 className="font-semibold text-white">Overview</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{tournament.description}</p>
        </div>

        {/* Rules */}
        {tournament.rules && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-5 text-cyan-400" />
              <h2 className="font-semibold text-white">Rules</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{tournament.rules}</p>
          </div>
        )}

        {/* Results (if finished) */}
        {tournament.status === 'finished' && results.length > 0 && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="size-5 text-yellow-400" />
              <h2 className="font-semibold text-white">Results</h2>
            </div>
            
            <div className="space-y-2">
              {results.slice(0, 10).map((result, index) => {
                const participant = athleteProfiles.find(p => p.id === result.userId);
                return (
                  <div key={result.userId} className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      result.rank === 1 ? 'bg-yellow-500 text-white' :
                      result.rank === 2 ? 'bg-gray-400 text-white' :
                      result.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {result.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{participant?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">
                        {result.scoreType === 'time' && `${result.score}s`}
                        {result.scoreType === 'weight' && `${result.score}kg`}
                        {result.scoreType === 'points' && `${result.score} pts`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {tournament.status === 'upcoming' && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 p-6 backdrop-blur">
          <button
            onClick={handleRegister}
            className={`w-full rounded-xl py-4 font-semibold transition-colors ${
              isRegistered
                ? 'bg-slate-700 text-white active:bg-slate-600'
                : 'bg-cyan-500 text-white active:bg-cyan-600'
            }`}
          >
            {isRegistered ? 'Remove from My Season' : 'Add to My Season'}
          </button>
        </div>
      )}
    </div>
  );
}