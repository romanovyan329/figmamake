import { ArrowLeft, Trophy, Award, TrendingUp, Calendar, MapPin, Wind, Target, Users, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface TournamentResultDetailScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function TournamentResultDetailScreen({ onNavigate, onBack }: TournamentResultDetailScreenProps) {
  const { selectedResultTournamentId, getEntry, tournaments } = useApp();
  
  const entry = selectedResultTournamentId ? getEntry(selectedResultTournamentId) : undefined;
  const tournament = tournaments.find(t => t.id === selectedResultTournamentId);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white flex items-center justify-center">
        <p className="font-['Inter',sans-serif] text-gray-600">Tournament not found</p>
      </div>
    );
  }

  const hasResults = entry?.results;
  const results = entry?.results;
  
  const days = hasResults ? [
    { day: 1, weight: results.day1Weight },
    { day: 2, weight: results.day2Weight },
    { day: 3, weight: results.day3Weight },
    { day: 4, weight: results.day4Weight }
  ].filter(d => d.weight !== undefined) : [];

  const avgPerDay = days.length > 0 && hasResults ? results.totalWeight / days.length : 0;
  const bestDay = days.length > 0 ? days.reduce((best, current) => 
    (current.weight || 0) > (best.weight || 0) ? current : best
  , days[0]) : null;

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-6 h-6 text-[#F0A720]" />;
    if (position === 2) return <Award className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Award className="w-6 h-6 text-[#CD7F32]" />;
    return null;
  };

  const getPositionBadgeColor = (position: number) => {
    if (position === 1) return 'bg-[#F0A720] text-white';
    if (position === 2) return 'bg-gray-400 text-white';
    if (position === 3) return 'bg-[#CD7F32] text-white';
    if (position <= 10) return 'bg-green-500 text-white';
    return 'bg-[#3F6692] text-white';
  };

  // Mock tournament overview data (in real app, this would be user input)
  const tournamentOverview = {
    winnerWeight: 25800, // Manual input field
    avgWeight: 18500, // Optional
    totalParticipants: tournament.participants // Optional
  };

  const hasWinnerWeight = tournamentOverview.winnerWeight > 0;
  const percentFromWinner = hasResults && hasWinnerWeight 
    ? ((results.totalWeight / tournamentOverview.winnerWeight) * 100).toFixed(1)
    : null;
  const diffFromWinner = hasResults && hasWinnerWeight
    ? tournamentOverview.winnerWeight - results.totalWeight
    : null;
  const positionPercentile = hasResults && results.finalPosition && tournamentOverview.totalParticipants
    ? (((tournamentOverview.totalParticipants - results.finalPosition) / tournamentOverview.totalParticipants) * 100).toFixed(0)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#207DF0] to-[#3F6692] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-['Figtree',sans-serif] font-black text-xl">
              {tournament.title}
            </h1>
            <p className="font-['Inter',sans-serif] text-sm opacity-90">
              {tournament.discipline} • {entry?.participationType === 'team' ? 'Team' : 'Individual'}
            </p>
          </div>
          {hasResults && results.finalPosition && getMedalIcon(results.finalPosition)}
        </div>

        {/* Position Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasResults && results.finalPosition ? (
              <>
                <div className={`${getPositionBadgeColor(results.finalPosition)} px-4 py-2 rounded-full font-['Figtree',sans-serif] font-bold text-lg`}>
                  #{results.finalPosition}
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] text-xs opacity-75">Final Position</p>
                  <p className="font-['Figtree',sans-serif] font-bold">
                    {results.finalPosition === 1 ? '🏆 Winner' : 
                     results.finalPosition === 2 ? '🥈 Second Place' :
                     results.finalPosition === 3 ? '🥉 Third Place' :
                     results.finalPosition <= 10 ? 'Top 10' : 'Completed'}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <p className="font-['Inter',sans-serif] text-sm opacity-90">Not Entered</p>
              </div>
            )}
          </div>
          {results?.prize && (
            <div className="text-right">
              <p className="font-['Inter',sans-serif] text-xs opacity-75">Prize</p>
              <p className="font-['Figtree',sans-serif] font-bold text-lg text-[#F0A720]">
                {results.prize}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+80px)]">
        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Performance Summary
          </h3>
          
          {hasResults ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#207DF0]/10 to-[#B0CBFF]/10 rounded-lg p-3">
                <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Total Weight</p>
                <p className="font-['Figtree',sans-serif] font-black text-2xl text-[#207DF0]">
                  {(results.totalWeight / 1000).toFixed(2)} kg
                </p>
              </div>
              
              {results.bigFish && (
                <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-lg p-3">
                  <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Big Fish</p>
                  <p className="font-['Figtree',sans-serif] font-black text-2xl text-[#F0A720]">
                    {(results.bigFish / 1000).toFixed(2)} kg
                  </p>
                </div>
              )}
              
              {days.length > 0 && (
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3">
                  <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Avg per Day</p>
                  <p className="font-['Figtree',sans-serif] font-black text-xl text-green-600">
                    {(avgPerDay / 1000).toFixed(2)} kg
                  </p>
                </div>
              )}
              
              {results.prize && (
                <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-lg p-3">
                  <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Prize Money</p>
                  <p className="font-['Figtree',sans-serif] font-black text-xl text-[#F0A720]">
                    {results.prize}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-['Inter',sans-serif] text-gray-500 mb-2">— No Results Available —</p>
              <p className="font-['Inter',sans-serif] text-gray-400 text-sm">
                Results will be published by federation administrators
              </p>
            </div>
          )}
        </div>

        {/* Tournament Overview - Optional Data */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Tournament Overview
          </h3>
          
          {hasWinnerWeight ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-[#F0A720]" />
                  <span className="font-['Inter',sans-serif] text-sm text-gray-700">Winner Weight</span>
                </div>
                <span className="font-['Figtree',sans-serif] font-bold text-[#F0A720]">
                  {(tournamentOverview.winnerWeight / 1000).toFixed(2)} kg
                </span>
              </div>
              
              {tournamentOverview.avgWeight > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-gray-600" />
                    <span className="font-['Inter',sans-serif] text-sm text-gray-700">Average Weight</span>
                  </div>
                  <span className="font-['Figtree',sans-serif] font-bold text-gray-700">
                    {(tournamentOverview.avgWeight / 1000).toFixed(2)} kg
                  </span>
                </div>
              )}
              
              {tournamentOverview.totalParticipants && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-['Inter',sans-serif] text-sm text-gray-700">Total Participants</span>
                  </div>
                  <span className="font-['Figtree',sans-serif] font-bold text-gray-700">
                    {tournamentOverview.totalParticipants}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="font-['Inter',sans-serif] text-gray-500 text-sm">— No Data Available —</p>
            </div>
          )}
        </div>

        {/* Your Performance Analysis */}
        {hasResults && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
              Your Performance Analysis
            </h3>
            
            {hasWinnerWeight ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#207DF0]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#207DF0]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] text-sm text-gray-900 font-medium">
                      % of Winner
                    </p>
                    <p className="font-['Figtree',sans-serif] text-lg font-bold text-[#207DF0]">
                      {percentFromWinner}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Scale className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] text-sm text-gray-900 font-medium">
                      Difference from Winner
                    </p>
                    <p className="font-['Figtree',sans-serif] text-lg font-bold text-gray-700">
                      -{(diffFromWinner! / 1000).toFixed(2)} kg
                    </p>
                  </div>
                </div>
                
                {positionPercentile && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter',sans-serif] text-sm text-gray-900 font-medium">
                        Position Percentile
                      </p>
                      <p className="font-['Figtree',sans-serif] text-lg font-bold text-green-600">
                        Top {positionPercentile}%
                      </p>
                    </div>
                  </div>
                )}
                
                {bestDay && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#F0A720]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-[#F0A720]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-['Inter',sans-serif] text-sm text-gray-900 font-medium">
                        Best Performing Day
                      </p>
                      <p className="font-['Figtree',sans-serif] text-lg font-bold text-[#F0A720]">
                        Day {bestDay.day} - {((bestDay.weight || 0) / 1000).toFixed(2)} kg
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="font-['Inter',sans-serif] text-gray-600 text-sm">
                  Additional tournament statistics not available
                </p>
              </div>
            )}
          </div>
        )}

        {/* Day-by-Day Breakdown */}
        {hasResults && days.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
              Day-by-Day Breakdown
            </h3>
            
            <div className="space-y-3">
              {days.map((d, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#207DF0]" />
                      <span className="font-['Figtree',sans-serif] font-bold text-gray-900">
                        Day {d.day}
                      </span>
                      {bestDay && bestDay.day === d.day && (
                        <span className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5 rounded-full font-['Inter',sans-serif] font-medium">
                          Best
                        </span>
                      )}
                    </div>
                    <span className="font-['Figtree',sans-serif] font-bold text-[#207DF0]">
                      {((d.weight || 0) / 1000).toFixed(2)} kg
                    </span>
                  </div>
                  
                  {results.section && index === 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="font-['Inter',sans-serif]">{results.section}</span>
                    </div>
                  )}
                  
                  {results.weather && index === 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Wind className="w-3 h-3" />
                      <span className="font-['Inter',sans-serif]">{results.weather}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes & Strategy */}
        {(results?.details || results?.notes || entry?.notes) && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
              Notes & Strategy
            </h3>
            
            {results?.details && (
              <div className="mb-3">
                <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-1">Performance Notes</p>
                <p className="font-['Inter',sans-serif] text-gray-900">{results.details}</p>
              </div>
            )}
            
            {results?.notes && (
              <div className="mb-3">
                <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-1">Post-Tournament Analysis</p>
                <p className="font-['Inter',sans-serif] text-gray-900">{results.notes}</p>
              </div>
            )}
            
            {entry?.notes && !results?.notes && (
              <div>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-1">Pre-Tournament Notes</p>
                <p className="font-['Inter',sans-serif] text-gray-900">{entry.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Team Info */}
        {entry?.participationType === 'team' && entry.team && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
              Team Information
            </h3>
            
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#207DF0]/10 to-[#B0CBFF]/10 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#207DF0] to-[#3F6692] rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-['Figtree',sans-serif] font-bold text-gray-900">{entry.team}</p>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600">Team Competition</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-[30px] left-0 right-0 px-4 pb-4 bg-gradient-to-t from-white via-white to-transparent">
        {tournament.status === 'completed' && tournament.officialResults ? (
          <Button 
            variant="accent1" 
            fullWidth 
            onClick={() => {
              // Navigate to leaderboard screen
              onNavigate('leaderboard');
            }}
          >
            View Full Leaderboard
          </Button>
        ) : tournament.status === 'results-pending' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="font-['Inter',sans-serif] text-yellow-800 text-sm font-medium">
              ⏳ Results Pending
            </p>
            <p className="font-['Inter',sans-serif] text-yellow-600 text-xs mt-1">
              Official results will be published by the federation
            </p>
          </div>
        ) : !hasResults ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="font-['Inter',sans-serif] text-gray-600 text-sm">
              Tournament in progress or not yet completed
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}