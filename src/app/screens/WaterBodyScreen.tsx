import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WaterBodyMap } from '../components/WaterBodyMap';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface WaterBodyScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function WaterBodyScreen({ onNavigate, onBack }: WaterBodyScreenProps) {
  const { selectedTournamentId, tournaments, myEntries } = useApp();
  const tournament = tournaments.find(t => t.id === selectedTournamentId);
  const waterBody = tournament?.waterBody;

  if (!waterBody) {
    return null;
  }

  // Find all tournaments at this water body
  const tournamentsHere = tournaments.filter(t => t.waterBody?.name === waterBody.name);
  
  // Check if user has stats here
  const myTournamentsHere = tournamentsHere.filter(t => 
    myEntries.some(e => e.tournamentId === t.id && e.results?.finalPosition)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            {waterBody.name}
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90">
          {tournament?.location}, {tournament?.country}
        </p>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+40px)]">
        {/* Water Body Image */}
        {waterBody.imageUrl ? (
          <div className="rounded-xl h-48 mb-6 overflow-hidden shadow-md">
            <img
              src={waterBody.imageUrl}
              alt={waterBody.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#207DF0]/20 to-[#B0CBFF]/30 rounded-xl h-48 mb-6 flex items-center justify-center">
            <p className="font-['Inter',sans-serif] text-sm text-gray-600">
              Water body photo
            </p>
          </div>
        )}

        {/* Interactive Map */}
        {waterBody.coordinates && (
          <div className="mb-6">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
              Location
            </h3>
            <WaterBodyMap 
              coordinates={waterBody.coordinates} 
              waterBodyName={waterBody.name}
            />
          </div>
        )}

        {/* Characteristics */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Characteristics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Type</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {waterBody.type}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Depth</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {waterBody.depth}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Target Fish</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {waterBody.targetFish}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Temperature</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {waterBody.temperature}
              </span>
            </div>
          </div>
        </div>

        {/* Tournaments Here */}
        <div className="mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Tournaments at this venue
          </h3>
          <div className="space-y-3">
            {tournamentsHere.map(t => (
              <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-1">
                  {t.title}
                </h4>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                  {t.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* My Stats Here */}
        {myTournamentsHere.length > 0 && (
          <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-xl p-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
              My Statistics Here
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Tournaments
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-2xl text-[#207DF0]">
                  {myTournamentsHere.length}
                </div>
              </div>
              <div>
                <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                  Best Result
                </div>
                <div className="font-['Figtree',sans-serif] font-bold text-2xl text-[#F0A720]">
                  #3
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}