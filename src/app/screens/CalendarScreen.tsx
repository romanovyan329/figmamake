import { BottomNav } from '../components/BottomNav';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface CalendarScreenProps {
  onNavigate: (screen: string) => void;
}

export function CalendarScreen({ onNavigate }: CalendarScreenProps) {
  const { tournaments, myEntries, setSelectedTournamentId } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026 (month is 0-indexed)

  // Format current month for display
  const currentMonth = currentDate.toLocaleString('en', { month: 'long', year: 'numeric' });

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    // Adjust so Monday = 0
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Sunday becomes 6
    
    return { daysInMonth, firstDayOfWeek };
  };

  const { daysInMonth, firstDayOfWeek } = getDaysInMonth();

  // Get tournaments that are in my season
  const myTournaments = myEntries.map(entry => {
    const tournament = tournaments.find(t => t.id === entry.tournamentId);
    return { entry, tournament };
  }).filter(item => item.tournament);

  // Filter tournaments for current month
  const tournamentsInMonth = myTournaments.filter(({ tournament }) => {
    if (!tournament) return false;
    const tournamentDate = new Date(tournament.startDate);
    return tournamentDate.getMonth() === currentDate.getMonth() && 
           tournamentDate.getFullYear() === currentDate.getFullYear();
  });

  // Get days with events for highlighting
  const daysWithEvents = new Set(
    tournamentsInMonth.map(({ tournament }) => {
      if (!tournament) return -1;
      return new Date(tournament.startDate).getDate();
    }).filter(day => day !== -1)
  );

  const handleTournamentClick = (tournamentId: number) => {
    setSelectedTournamentId(tournamentId);
    onNavigate('tournament-details');
  };

  const handleAddTournament = () => {
    onNavigate('search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6 rounded-b-3xl">
        <h1 className="font-['Figtree',sans-serif] font-black text-2xl mb-2">
          My Season
        </h1>
        <p className="font-['Inter',sans-serif] text-sm opacity-90">
          {myTournaments.length} tournament{myTournaments.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {/* Month Navigator */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <button className="p-2" onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
            {currentMonth}
          </h2>
          <button className="p-2" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid - Simplified */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center font-['Inter',sans-serif] text-xs text-gray-600 font-semibold">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {/* Actual days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const hasEvent = daysWithEvents.has(day);
              return (
                <button
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center font-['Inter',sans-serif] text-sm ${
                    hasEvent 
                      ? 'bg-[#207DF0] text-white font-bold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="px-4 pb-[calc(30px+80px)]">
        <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Scheduled Tournaments
        </h3>
        
        {myTournaments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-[#207DF0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
              No Tournaments Yet
            </h4>
            <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-4">
              Add tournaments to build your season
            </p>
            <button
              onClick={handleAddTournament}
              className="bg-[#F0A720] text-white px-6 py-3 rounded-xl font-['Figtree',sans-serif] font-bold"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myTournaments.map(({ entry, tournament }) => {
              if (!tournament) return null;
              
              const startDate = new Date(tournament.startDate);
              const day = startDate.getDate();
              const month = startDate.toLocaleString('en', { month: 'short' }).toUpperCase();

              return (
                <div 
                  key={entry.tournamentId} 
                  onClick={() => handleTournamentClick(tournament.id)}
                  className="bg-white rounded-xl p-4 shadow-md flex gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#207DF0]">
                      {day}
                    </div>
                    <div className="font-['Inter',sans-serif] text-xs text-gray-600 font-semibold">
                      {month}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-1">
                      {tournament.title}
                    </h4>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-2">
                      {tournament.location}, {tournament.country}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold bg-[#207DF0]/10 text-[#207DF0]">
                        {tournament.discipline}
                      </span>
                      {entry.goal && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold bg-[#F0A720]/10 text-[#F0A720]">
                          Goal: {entry.goal}
                        </span>
                      )}
                      {entry.results?.finalPosition && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-['Inter',sans-serif] font-semibold bg-green-100 text-green-700">
                          #{entry.results.finalPosition}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Tournament Button */}
      {myTournaments.length > 0 && (
        <div className="fixed bottom-[calc(30px+80px+16px)] right-4">
          <button 
            onClick={handleAddTournament}
            className="bg-[#F0A720] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#F0A720]/90 transition-colors"
          >
            <span className="text-2xl font-bold">+</span>
          </button>
        </div>
      )}

      <BottomNav active="calendar" onNavigate={onNavigate} />
    </div>
  );
}