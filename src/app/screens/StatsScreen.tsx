import { BottomNav } from '../components/BottomNav';
import { StatCard } from '../components/StatCard';
import { SimpleLineChart } from '../components/SimpleLineChart';
import { BarChart3, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMemo } from 'react';

interface StatsScreenProps {
  onNavigate: (screen: string) => void;
}

export function StatsScreen({ onNavigate }: StatsScreenProps) {
  const { myEntries, tournaments } = useApp();

  // Calculate stats
  const totalTournaments = myEntries.length;
  const completedTournaments = myEntries.filter(e => e.results?.finalPosition).length;
  
  // Group by discipline
  const byDiscipline = myEntries.reduce((acc, entry) => {
    const tournament = tournaments.find(t => t.id === entry.tournamentId);
    if (tournament) {
      const discipline = tournament.discipline;
      if (!acc[discipline]) {
        acc[discipline] = { count: 0, positions: [] };
      }
      acc[discipline].count++;
      if (entry.results?.finalPosition) {
        acc[discipline].positions.push(entry.results.finalPosition);
      }
    }
    return acc;
  }, {} as Record<string, { count: number; positions: number[] }>);

  const disciplineStats = Object.entries(byDiscipline).map(([name, data]) => ({
    name,
    tournaments: data.count,
    avgPos: data.positions.length > 0 
      ? (data.positions.reduce((a, b) => a + b, 0) / data.positions.length).toFixed(1)
      : '-',
    bestPos: data.positions.length > 0 
      ? Math.min(...data.positions)
      : '-'
  }));

  // Prepare chart data - completed tournaments with positions over time
  const chartData = useMemo(() => {
    const completedWithPositions = myEntries
      .filter(entry => entry.results?.finalPosition)
      .map((entry) => {
        const tournament = tournaments.find(t => t.id === entry.tournamentId);
        return {
          tournamentId: entry.tournamentId,
          date: tournament?.startDate || '',
          name: tournament?.title.split(' ')[0] || 'Event',
          position: entry.results!.finalPosition!,
          discipline: tournament?.discipline || ''
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Add unique indices after sorting to ensure uniqueness
    return completedWithPositions.map((item, index) => ({
      ...item,
      displayName: `${item.name} #${index + 1}`,
      chartIndex: index
    }));
  }, [myEntries, tournaments]);

  const hasChartData = chartData.length > 0;

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-['Figtree',sans-serif] font-bold text-gray-900 text-sm">
            {data.displayName}
          </p>
          <p className="font-['Inter',sans-serif] text-xs text-gray-600">
            {data.discipline}
          </p>
          <p className="font-['Figtree',sans-serif] font-bold text-[#207DF0] text-lg mt-1">
            Position #{data.position}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6 rounded-b-3xl">
        <h1 className="font-['Figtree',sans-serif] font-black text-2xl mb-2">
          Career Analytics
        </h1>
        <p className="font-['Inter',sans-serif] text-sm opacity-90">
          Track your performance and progress
        </p>
      </div>

      {/* Season Overview */}
      <div className="px-4 mt-6 pb-[calc(30px+80px)]">
        {totalTournaments === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-[#207DF0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-[#207DF0]" />
            </div>
            <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
              No Statistics Yet
            </h4>
            <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-4">
              Add tournaments to your season to start tracking
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#F0A720] text-white px-6 py-3 rounded-xl font-['Figtree',sans-serif] font-bold"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
              Season 2026
            </h2>
            
            {/* View History Button */}
            {completedTournaments > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="w-full bg-gradient-to-r from-[#F0A720] to-[#F0A720]/80 text-white rounded-xl p-4 shadow-md mb-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-['Figtree',sans-serif] font-bold text-lg">
                      Tournament History
                    </div>
                    <div className="font-['Inter',sans-serif] text-sm opacity-90">
                      View {completedTournaments} completed event{completedTournaments !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-2xl">→</div>
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard
                title="Tournaments"
                value={totalTournaments.toString()}
                subtitle={`${completedTournaments} completed`}
                icon="target"
              />
              <StatCard
                title="Best Position"
                value={completedTournaments > 0 ? `#${Math.min(...myEntries.filter(e => e.results?.finalPosition).map(e => e.results!.finalPosition!))}` : '-'}
                subtitle="Personal best"
                icon="award"
              />
              <StatCard
                title="Disciplines"
                value={Object.keys(byDiscipline).length.toString()}
                subtitle="Different types"
              />
              <StatCard
                title="Upcoming"
                value={(totalTournaments - completedTournaments).toString()}
                subtitle="Scheduled"
              />
            </div>

            {/* Performance by Discipline */}
            {disciplineStats.length > 0 && (
              <>
                <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
                  By Discipline
                </h3>
                
                <div className="space-y-3 mb-6">
                  {disciplineStats.map(discipline => (
                    <div key={discipline.name} className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                          {discipline.name}
                        </h4>
                        <span className="font-['Inter',sans-serif] text-sm text-gray-600">
                          {discipline.tournaments} tournament{discipline.tournaments !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                            Avg. Position
                          </div>
                          <div className="font-['Figtree',sans-serif] font-bold text-xl text-[#207DF0]">
                            {discipline.avgPos}
                          </div>
                        </div>
                        <div>
                          <div className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                            Best Result
                          </div>
                          <div className="font-['Figtree',sans-serif] font-bold text-xl text-[#F0A720]">
                            {typeof discipline.bestPos === 'number' ? `#${discipline.bestPos}` : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Progress Chart */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-3">
                Position Dynamics
              </h3>
              {hasChartData ? (
                <div className="relative">
                  <SimpleLineChart data={chartData} />
                  <div className="mt-2 text-center">
                    <p className="font-['Inter',sans-serif] text-xs text-gray-500">
                      {chartData.length} completed tournament{chartData.length !== 1 ? 's' : ''} • Lower position = Better result
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-[#207DF0]/10 to-[#B0CBFF]/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-[#207DF0] mx-auto mb-2" />
                    <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                      Complete tournaments to see your progress
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <BottomNav active="stats" onNavigate={onNavigate} />
    </div>
  );
}