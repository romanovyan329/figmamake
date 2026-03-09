import { ArrowLeft, Trophy, Award, Users, Calendar, MapPin, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeaderboardScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function LeaderboardScreen({ onNavigate, onBack }: LeaderboardScreenProps) {
  const { selectedResultTournamentId, tournaments, userProfile } = useApp();
  
  const tournament = tournaments.find(t => t.id === selectedResultTournamentId);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white flex items-center justify-center">
        <p className="font-['Inter',sans-serif] text-gray-600">Tournament not found</p>
      </div>
    );
  }

  const officialResults = tournament.officialResults || [];
  const hasResults = officialResults.length > 0;

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-[#F0A720]" />;
    if (position === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Award className="w-5 h-5 text-[#CD7F32]" />;
    return null;
  };

  const getPositionBadgeColor = (position: number) => {
    if (position === 1) return 'bg-[#F0A720] text-white';
    if (position === 2) return 'bg-gray-400 text-white';
    if (position === 3) return 'bg-[#CD7F32] text-white';
    if (position <= 10) return 'bg-green-500 text-white';
    return 'bg-[#3F6692] text-white';
  };

  // Check if user is in the results (only for verified users)
  const isVerified = userProfile?.federationLicenseStatus === 'verified';
  const userResult = isVerified ? officialResults.find(
    r => r.federationId === userProfile?.federationLicenseId
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#207DF0] to-[#3F6692] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
              Official Leaderboard
            </h1>
            <p className="font-['Inter',sans-serif] text-sm opacity-90 mt-1">
              {tournament.title}
            </p>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="font-['Inter',sans-serif]">{tournament.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="font-['Inter',sans-serif]">{tournament.location}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+24px)]">
        {/* User's Result Highlight */}
        {userResult && (
          <div className="bg-gradient-to-br from-[#207DF0]/10 to-[#B0CBFF]/10 border-2 border-[#207DF0]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#207DF0] to-[#3F6692] rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-['Inter',sans-serif] text-xs text-gray-600">Your Position</p>
                <p className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
                  #{userResult.position} of {tournament.participants}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="font-['Inter',sans-serif] text-xs text-gray-600">Total Weight</p>
                <p className="font-['Figtree',sans-serif] font-bold text-[#207DF0]">
                  {(userResult.totalWeight / 1000).toFixed(2)} kg
                </p>
              </div>
              {userResult.bigFish && (
                <div>
                  <p className="font-['Inter',sans-serif] text-xs text-gray-600">Big Fish</p>
                  <p className="font-['Figtree',sans-serif] font-bold text-[#F0A720]">
                    {(userResult.bigFish / 1000).toFixed(2)} kg
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-[#207DF0] to-[#3F6692] px-4 py-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants ({officialResults.length})
            </h3>
          </div>

          {hasResults ? (
            <div className="divide-y divide-gray-100">
              {officialResults.map((result, index) => {
                const isUser = result.federationId === userProfile?.federationLicenseId;
                
                return (
                  <div
                    key={index}
                    className={`p-4 ${isUser ? 'bg-blue-50 border-l-4 border-[#207DF0]' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Position */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {getMedalIcon(result.position) || (
                          <div className={`${getPositionBadgeColor(result.position)} w-8 h-8 rounded-full flex items-center justify-center mx-auto`}>
                            <span className="font-['Figtree',sans-serif] font-bold text-sm">
                              {result.position}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Athlete Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-['Figtree',sans-serif] font-bold text-gray-900 truncate">
                            {result.athleteName}
                          </p>
                          {isUser && (
                            <span className="bg-[#207DF0] text-white text-xs px-2 py-0.5 rounded-full font-['Inter',sans-serif] font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                            {result.country}
                          </span>
                          {result.team && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                                {result.team}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Weight */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <Scale className="w-4 h-4 text-[#207DF0]" />
                          <p className="font-['Figtree',sans-serif] font-bold text-[#207DF0]">
                            {(result.totalWeight / 1000).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-['Inter',sans-serif] text-xs text-gray-600">kg</p>
                        {result.bigFish && (
                          <p className="font-['Inter',sans-serif] text-xs text-[#F0A720] mt-1">
                            BF: {(result.bigFish / 1000).toFixed(2)} kg
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(result.section || result.peg) && (
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600 font-['Inter',sans-serif] ml-15">
                        {result.section && (
                          <span>Section: {result.section}</span>
                        )}
                        {result.peg && (
                          <span>Peg: {result.peg}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-['Inter',sans-serif] text-gray-500 mb-2">
                — Results Not Available —
              </p>
              <p className="font-['Inter',sans-serif] text-sm text-gray-400">
                Official results will be published by the federation
              </p>
            </div>
          )}
        </div>

        {/* Tournament Stats */}
        {hasResults && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-4">
              Tournament Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-lg p-3">
                <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Winner Weight</p>
                <p className="font-['Figtree',sans-serif] font-black text-xl text-[#F0A720]">
                  {(officialResults[0]?.totalWeight / 1000).toFixed(2)} kg
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#207DF0]/10 to-[#B0CBFF]/10 rounded-lg p-3">
                <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Participants</p>
                <p className="font-['Figtree',sans-serif] font-black text-xl text-[#207DF0]">
                  {officialResults.length}
                </p>
              </div>
              {officialResults.some(r => r.bigFish) && (
                <>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3">
                    <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Biggest Fish</p>
                    <p className="font-['Figtree',sans-serif] font-black text-xl text-green-600">
                      {Math.max(...officialResults.filter(r => r.bigFish).map(r => r.bigFish!)) / 1000} kg
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-500/10 to-gray-500/5 rounded-lg p-3">
                    <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Avg Weight</p>
                    <p className="font-['Figtree',sans-serif] font-black text-xl text-gray-700">
                      {(officialResults.reduce((sum, r) => sum + r.totalWeight, 0) / officialResults.length / 1000).toFixed(2)} kg
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}