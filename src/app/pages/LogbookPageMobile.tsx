import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Navigation, Cloud, FileText, ChevronRight, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { logbookEntries as initialLogbookEntries, LogEntry } from '../data/mockData';
import { AddTripForm } from '../components/AddTripForm';

export function LogbookPageMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showAddTripForm, setShowAddTripForm] = useState(false);

  // Get trips from localStorage
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('logbookEntries');
    return saved ? JSON.parse(saved) : initialLogbookEntries;
  });

  // Reload trips when form closes
  useEffect(() => {
    if (!showAddTripForm) {
      const saved = localStorage.getItem('logbookEntries');
      if (saved) {
        try {
          setTrips(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load trips:', e);
        }
      }
    }
  }, [showAddTripForm]);

  const totalDistance = trips.reduce((sum: number, entry: any) => sum + entry.distance, 0);
  const totalHours = trips.reduce((sum: number, entry: any) => sum + entry.duration, 0);

  // Restore scroll position when returning from trip details
  useEffect(() => {
    if (location.state?.scrollPosition && containerRef.current) {
      containerRef.current.scrollTop = location.state.scrollPosition;
    }
  }, [location.state]);

  const handleTripClick = (tripId: string) => {
    const scrollPosition = containerRef.current?.scrollTop || 0;
    navigate(`/logbook/${tripId}`, { state: { scrollPosition } });
  };

  const handleSaveTrip = (trip: Omit<LogEntry, 'id'>) => {
    // Generate new ID
    const newId = String(trips.length + 1);
    const newTrip: LogEntry = {
      ...trip,
      id: newId,
    };

    // Add to trips array
    const updatedTrips = [newTrip, ...trips]; // Add at beginning (newest first)
    setTrips(updatedTrips);

    // Save to localStorage
    localStorage.setItem('logbookEntries', JSON.stringify(updatedTrips));

    // Close form
    setShowAddTripForm(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-y-auto bg-slate-950 text-white">
      <div className="space-y-6 px-6 pb-6 pt-16">
        {/* Title */}
        <h1 className="text-xl font-semibold text-white">Logbook</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">{trips.length}</div>
            <div className="text-xs text-slate-400">Trips</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">{totalDistance.toFixed(0)}</div>
            <div className="text-xs text-slate-400">Total NM</div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold">{totalHours.toFixed(0)}</div>
            <div className="text-xs text-slate-400">Hours</div>
          </div>
        </div>

        {/* Trip History */}
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">Trip History</h2>
          
          <div className="space-y-3">
            {trips.map((entry) => (
              <button
                key={entry.id}
                onClick={() => handleTripClick(entry.id)}
                className="w-full rounded-xl bg-slate-900 p-4 text-left transition-colors active:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="mt-2 font-semibold text-cyan-400">{entry.routeName}</div>

                    <div className="mt-3 flex gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="size-4" />
                        <span>{entry.duration}h</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Navigation className="size-4" />
                        <span>{entry.distance} nm</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="size-5 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-6">
          <div className="mb-4 text-sm font-medium uppercase tracking-wider text-cyan-400">March 2026 Summary</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">
                {trips.filter(e => e.date.startsWith('2026-03')).length}
              </div>
              <div className="text-xs text-cyan-300">Trips</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {trips
                  .filter(e => e.date.startsWith('2026-03'))
                  .reduce((sum, e) => sum + e.distance, 0)
                  .toFixed(0)}
              </div>
              <div className="text-xs text-cyan-300">Miles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {trips
                  .filter(e => e.date.startsWith('2026-03'))
                  .reduce((sum, e) => sum + e.duration, 0)
                  .toFixed(1)}
              </div>
              <div className="text-xs text-cyan-300">Hours</div>
            </div>
          </div>
        </div>

        {/* Add Trip Button */}
        <button
          onClick={() => setShowAddTripForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-semibold transition-colors active:bg-cyan-600"
        >
          <Plus className="size-5" />
          Add New Trip
        </button>
      </div>

      {/* Add Trip Form */}
      {showAddTripForm && (
        <AddTripForm
          onSave={handleSaveTrip}
          onClose={() => setShowAddTripForm(false)}
        />
      )}
    </div>
  );
}