import { MapPin, Calendar, Users, Trophy, ArrowLeft, Fish } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

interface TournamentDetailsScreenProps {
  onNavigate: (screen: string) => void;
}

export function TournamentDetailsScreen({ onNavigate }: TournamentDetailsScreenProps) {
  const { selectedTournamentId, tournaments, isInMySeason, setSelectedTournamentId } = useApp();
  const tournament = tournaments.find(t => t.id === selectedTournamentId);

  if (!tournament) {
    return null;
  }

  const inSeason = isInMySeason(tournament.id);

  const handleAddToSeason = () => {
    onNavigate('register');
  };

  const handleViewWaterBody = () => {
    onNavigate('water-body');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registration': return 'Open';
      case 'upcoming': return 'Upcoming';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header with back button */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <button 
          onClick={() => onNavigate('home')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-['Inter',sans-serif]">Back</span>
        </button>
        <div className="flex justify-between items-start mb-2">
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl flex-1">
            {tournament.title}
          </h1>
          <span className={`px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>
        <button 
          onClick={handleViewWaterBody}
          className="flex items-center gap-2 opacity-90 hover:opacity-100"
        >
          <MapPin className="w-4 h-4" />
          <span className="font-['Inter',sans-serif] text-sm underline">
            {tournament.location}, {tournament.country}
          </span>
        </button>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+40px)]">
        {/* Status Badge if Added */}
        {inSeason && (
          <div className="bg-gradient-to-r from-[#F0A720]/20 to-[#F0A720]/10 border-2 border-[#F0A720] rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F0A720] rounded-full flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <div>
              <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                Added to My Season
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                You're registered for this tournament
              </p>
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#207DF0] mt-1" />
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Date
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  {tournament.date}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#207DF0] mt-1" />
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Participants
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  {tournament.participants} athletes
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-[#207DF0] mt-1" />
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Prize Pool
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  {tournament.prize}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Fish className="w-5 h-5 text-[#207DF0] mt-1" />
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Discipline
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  {tournament.discipline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {tournament.description && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
              About Tournament
            </h3>
            <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
              {tournament.description}
            </p>
          </div>
        )}

        {/* Water Body Info */}
        {tournament.waterBody && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
                Water Body
              </h3>
              <button 
                onClick={handleViewWaterBody}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                View Details
              </button>
            </div>
            
            {/* Water Body Image */}
            {tournament.waterBody.imageUrl && (
              <div className="rounded-xl h-40 mb-4 overflow-hidden">
                <img
                  src={tournament.waterBody.imageUrl}
                  alt={tournament.waterBody.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-['Inter',sans-serif] text-sm text-gray-600">Name</span>
                <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                  {tournament.waterBody.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Inter',sans-serif] text-sm text-gray-600">Type</span>
                <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                  {tournament.waterBody.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['Inter',sans-serif] text-sm text-gray-600">Target Fish</span>
                <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                  {tournament.waterBody.targetFish}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Registration */}
        {tournament.status !== 'closed' && (
          <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-['Figtree',sans-serif] font-bold text-gray-900">
                Registration
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold ${getStatusColor(tournament.status)}`}>
                {getStatusText(tournament.status)}
              </span>
            </div>
            {tournament.registrationDeadline && (
              <p className="font-['Inter',sans-serif] text-sm text-gray-700 mb-3">
                Registration closes on {tournament.registrationDeadline}
              </p>
            )}
            {tournament.entryFee && (
              <div className="font-['Inter',sans-serif] text-sm text-gray-600 mb-1">
                Entry Fee: <span className="font-semibold text-gray-900">{tournament.entryFee}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!inSeason && tournament.status !== 'closed' ? (
            <Button variant="accent1" fullWidth onClick={handleAddToSeason}>
              Add to My Season
            </Button>
          ) : inSeason ? (
            <Button variant="accent2" fullWidth onClick={() => onNavigate('calendar')}>
              View My Entry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}