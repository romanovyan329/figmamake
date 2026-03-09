import { MapPin, Calendar, Users, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import { Tournament } from '../types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onDetails: (id: number) => void;
  onRegister?: (id: number) => void;
}

export function TournamentCard({ tournament, onDetails, onRegister }: TournamentCardProps) {
  const { isInMySeason } = useApp();
  const inSeason = isInMySeason(tournament.id);

  return (
    <div 
      onClick={() => onDetails(tournament.id)}
      className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            {inSeason && (
              <CheckCircle className="w-5 h-5 text-[#F0A720] flex-shrink-0 mt-0.5" />
            )}
            <h3 className="font-['Inter',sans-serif] font-bold text-lg text-gray-900">
              {tournament.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="font-['Inter',sans-serif] text-sm">
              {tournament.location}, {tournament.country}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold ${
          tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
          tournament.status === 'registration' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {tournament.status === 'upcoming' ? 'Upcoming' :
           tournament.status === 'registration' ? 'Open' : 'Completed'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600 font-['Inter',sans-serif]">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{tournament.date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{tournament.participants} athletes</span>
        </div>
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          <span>{tournament.prize}</span>
        </div>
      </div>

      <div className="mb-3">
        <span className="inline-block bg-[#207DF0]/10 text-[#207DF0] px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold">
          {tournament.discipline}
        </span>
      </div>

      <div className="flex gap-2">
        {!inSeason && tournament.status === 'registration' && onRegister && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRegister(tournament.id);
            }}
            className="flex-1 bg-[#F0A720] text-white font-['Inter',sans-serif] font-bold py-2 px-4 rounded-lg hover:bg-[#F0A720]/90 transition-colors"
          >
            Add to Season
          </button>
        )}
        {inSeason && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDetails(tournament.id);
            }}
            className="flex-1 bg-[#F0A720]/10 text-[#F0A720] font-['Inter',sans-serif] font-bold py-2 px-4 rounded-lg border-2 border-[#F0A720]"
          >
            In My Season
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDetails(tournament.id);
          }}
          className="flex-1 bg-[#3F6692] text-white font-['Inter',sans-serif] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#3F6692]/90 transition-colors"
        >
          Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}