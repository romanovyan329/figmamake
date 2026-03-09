import { BottomNav } from '../components/BottomNav';
import { Trophy, TrendingUp, Target, Award, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

interface HistoryScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function HistoryScreen({ onNavigate, onBack }: HistoryScreenProps) {
  const { myEntries, tournaments, setSelectedResultTournamentId } = useApp();
  const [filter, setFilter] = useState<'all' | 'podium' | 'top10'>('all');

  // Get all completed tournaments with results
  const completedTournaments = myEntries
    .filter(entry => entry.results)
    .map(entry => {
      const tournament = tournaments.find(t => t.id === entry.tournamentId);
      return tournament ? { tournament, entry } : null;
    })
    .filter((item): item is { tournament: Tournament; entry: TournamentEntry } => item !== null)
    .sort((a, b) => new Date(b.tournament.endDate).getTime() - new Date(a.tournament.endDate).getTime());

  const filteredTournaments = completedTournaments.filter(({ entry }) => {
    if (filter === 'podium') return entry.results && entry.results.finalPosition <= 3;
    if (filter === 'top10') return entry.results && entry.results.finalPosition <= 10;
    return true;
  });

  const handleTournamentClick = (entryTournamentId: number) => {
    setSelectedResultTournamentId(entryTournamentId);
    onNavigate('tournament-result-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#207DF0] text-white rounded-b-3xl shadow-lg">
        <div className="px-4 pt-[calc(env(safe-area-inset-top)+40px)] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => onBack ? onBack() : onNavigate('stats')} 
              className="p-2 -ml-2 text-white hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
              aria-label="Go back to stats"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
              Tournament History
            </h1>
          </div>
          <p className="font-['Inter',sans-serif] text-sm opacity-90 ml-11">
            {completedTournaments.length} completed event{completedTournaments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Career Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#F0A720]/10 to-[#F0A720]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-[#F0A720]" />
                <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                  Podium
                </span>
              </div>
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#F0A720]">
                {completedTournaments.filter(t => t.entry.results && t.entry.results.finalPosition <= 3).length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#207DF0]/10 to-[#207DF0]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#207DF0]" />
                <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                  Top 10
                </span>
              </div>
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#207DF0]">
                {completedTournaments.filter(t => t.entry.results && t.entry.results.finalPosition <= 10).length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3F6692]/10 to-[#3F6692]/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-[#3F6692]" />
                <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                  Events
                </span>
              </div>
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#3F6692]">
                {completedTournaments.length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-green-600" />
                <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                  Prize Money
                </span>
              </div>
              <div className="font-['Figtree',sans-serif] font-black text-xl text-green-600">
                €{completedTournaments.reduce((sum, t) => {
                  const prize = t.entry.results?.prize || '€0';
                  return sum + parseInt(prize.replace(/[€,]/g, '')) || 0;
                }, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-[#207DF0] text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setFilter('podium')}
            className={`flex-1 py-2 px-4 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
              filter === 'podium'
                ? 'bg-[#F0A720] text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Podium
          </button>
          <button
            onClick={() => setFilter('top10')}
            className={`flex-1 py-2 px-4 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
              filter === 'top10'
                ? 'bg-[#3F6692] text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            Top 10
          </button>
        </div>
      </div>

      {/* Tournament History List */}
      <div className="px-4 pb-[calc(30px+80px)]">
        <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Results ({filteredTournaments.length})
        </h3>

        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-[#207DF0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-[#207DF0]" />
            </div>
            <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
              No Results Found
            </h4>
            <p className="font-['Inter',sans-serif] text-sm text-gray-600">
              Try adjusting your filter
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTournaments.map(({ entry, tournament }) => {
              const results = entry.results!;
              const isPodium = results.finalPosition <= 3;
              const isTop10 = results.finalPosition <= 10;
              const isWinner = results.finalPosition === 1;

              return (
                <div
                  key={entry.tournamentId}
                  onClick={() => handleTournamentClick(entry.tournamentId)}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Position Badge */}
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center font-['Figtree',sans-serif] font-black text-xl ${
                        isWinner
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                          : isPodium
                          ? 'bg-gradient-to-br from-[#F0A720] to-[#F0A720]/80 text-white'
                          : isTop10
                          ? 'bg-gradient-to-br from-[#207DF0] to-[#207DF0]/80 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{results.finalPosition}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-1">
                        {entry.notes || `Tournament #${entry.tournamentId}`}
                      </h4>
                      <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-2">
                        {entry.participationType === 'team' ? `Team: ${entry.team}` : 'Individual'}
                      </p>

                      {/* Results Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                            Total Weight
                          </div>
                          <div className="font-['Figtree',sans-serif] font-bold text-sm text-gray-900">
                            {(results.totalWeight / 1000).toFixed(2)} kg
                          </div>
                        </div>
                        <div>
                          <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                            Big Fish
                          </div>
                          <div className="font-['Figtree',sans-serif] font-bold text-sm text-gray-900">
                            {(results.bigFish / 1000).toFixed(2)} kg
                          </div>
                        </div>
                        <div>
                          <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                            Prize
                          </div>
                          <div className="font-['Figtree',sans-serif] font-bold text-sm text-green-600">
                            {results.prize}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {results.details && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="font-['Inter',sans-serif] text-xs text-gray-700">
                        {results.details}
                      </p>
                    </div>
                  )}

                  {/* Section Info */}
                  {results.section && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-['Inter',sans-serif] text-xs text-gray-600">
                        {results.section}
                      </span>
                      {isWinner && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Trophy className="w-4 h-4" />
                          <span className="font-['Inter',sans-serif] text-xs font-bold">
                            CHAMPION
                          </span>
                        </span>
                      )}
                      {isPodium && !isWinner && (
                        <span className="flex items-center gap-1 text-[#F0A720]">
                          <Award className="w-4 h-4" />
                          <span className="font-['Inter',sans-serif] text-xs font-bold">
                            PODIUM
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  );
}