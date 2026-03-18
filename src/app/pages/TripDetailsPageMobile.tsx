import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Navigation,
  Wind,
  Waves,
  Gauge,
  Thermometer,
  Eye,
  FileText,
  Edit,
  Trash2,
  Fuel,
  Zap,
  Plus,
  X,
  Save
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { logbookEntries as initialLogbookEntries, LogbookEntry } from '../data/mockData';

interface TimelineEvent {
  time: string;
  event: string;
}

export function TripDetailsPageMobile() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tripId]);

  // State management
  const [trips, setTrips] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('logbookEntries');
    return saved ? JSON.parse(saved) : initialLogbookEntries;
  });

  const [activeScreen, setActiveScreen] = useState<'details' | 'edit' | 'deleteConfirm'>('details');
  const [editingTrip, setEditingTrip] = useState<LogbookEntry | null>(null);
  const [editingTimelineIndex, setEditingTimelineIndex] = useState<number | null>(null);
  const [timelineEventForm, setTimelineEventForm] = useState({ time: '', event: '' });

  const trip = trips.find(entry => entry.id === tripId);

  // Save trips to localStorage
  useEffect(() => {
    localStorage.setItem('logbookEntries', JSON.stringify(trips));
  }, [trips]);

  const handleBack = () => {
    navigate('/logbook', { state: { scrollPosition: location.state?.scrollPosition } });
  };

  const handleEditTrip = () => {
    if (trip) {
      setEditingTrip({ ...trip });
      setActiveScreen('edit');
    }
  };

  const handleSaveTrip = () => {
    if (editingTrip) {
      setTrips(trips.map(t => t.id === editingTrip.id ? editingTrip : t));
      setActiveScreen('details');
      setEditingTrip(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
    setActiveScreen('details');
  };

  const handleDeleteTrip = () => {
    setActiveScreen('deleteConfirm');
  };

  const handleConfirmDelete = () => {
    setTrips(trips.filter(t => t.id !== tripId));
    navigate('/logbook');
  };

  const handleAddTimelineEvent = () => {
    if (editingTrip && timelineEventForm.time && timelineEventForm.event) {
      const newTimeline = [...(editingTrip.timeline || []), { ...timelineEventForm }];
      setEditingTrip({ ...editingTrip, timeline: newTimeline });
      setTimelineEventForm({ time: '', event: '' });
    }
  };

  const handleEditTimelineEvent = (index: number) => {
    if (editingTrip && editingTrip.timeline) {
      setEditingTimelineIndex(index);
      setTimelineEventForm(editingTrip.timeline[index]);
    }
  };

  const handleSaveTimelineEvent = () => {
    if (editingTrip && editingTimelineIndex !== null && editingTrip.timeline) {
      const newTimeline = [...editingTrip.timeline];
      newTimeline[editingTimelineIndex] = { ...timelineEventForm };
      setEditingTrip({ ...editingTrip, timeline: newTimeline });
      setEditingTimelineIndex(null);
      setTimelineEventForm({ time: '', event: '' });
    }
  };

  const handleDeleteTimelineEvent = (index: number) => {
    if (editingTrip && editingTrip.timeline) {
      const newTimeline = editingTrip.timeline.filter((_, i) => i !== index);
      setEditingTrip({ ...editingTrip, timeline: newTimeline });
    }
  };

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-slate-400">Trip not found</p>
          <button
            onClick={() => navigate('/logbook')}
            className="mt-4 text-cyan-400"
          >
            Back to Logbook
          </button>
        </div>
      </div>
    );
  }

  // Delete Confirmation Modal
  if (activeScreen === 'deleteConfirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-white">Delete this trip?</h2>
          <p className="mt-2 text-sm text-slate-400">This action cannot be undone.</p>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={handleConfirmDelete}
              className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white transition-colors active:bg-red-600"
            >
              Delete Trip
            </button>
            <button
              onClick={() => setActiveScreen('details')}
              className="w-full rounded-xl bg-slate-800 py-3 font-semibold text-white transition-colors active:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Trip Screen
  if (activeScreen === 'edit' && editingTrip) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 pt-[60px]">
            <button onClick={handleCancelEdit} className="flex size-10 items-center justify-center rounded-full bg-slate-800">
              <X className="size-5" />
            </button>
            <h2 className="text-xl font-semibold text-white">Edit Trip</h2>
            <button onClick={handleSaveTrip} className="flex size-10 items-center justify-center rounded-full bg-green-500">
              <Save className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-4">
              {/* Trip Name */}
              <div>
                <label className="mb-2 block text-sm text-slate-400">Trip Name</label>
                <input
                  type="text"
                  value={editingTrip.routeName}
                  onChange={(e) => setEditingTrip({ ...editingTrip, routeName: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm text-slate-400">Date</label>
                <input
                  type="date"
                  value={editingTrip.date}
                  onChange={(e) => setEditingTrip({ ...editingTrip, date: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">Departure Time</label>
                  <input
                    type="time"
                    value={editingTrip.departureTime || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, departureTime: e.target.value })}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">Arrival Time</label>
                  <input
                    type="time"
                    value={editingTrip.arrivalTime || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, arrivalTime: e.target.value })}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div>
                <label className="mb-2 block text-sm text-slate-400">Start Point</label>
                <input
                  type="text"
                  value={editingTrip.departure}
                  onChange={(e) => setEditingTrip({ ...editingTrip, departure: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Destination</label>
                <input
                  type="text"
                  value={editingTrip.destination}
                  onChange={(e) => setEditingTrip({ ...editingTrip, destination: e.target.value })}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Numeric Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">Distance (nm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingTrip.distance}
                    onChange={(e) => setEditingTrip({ ...editingTrip, distance: parseFloat(e.target.value) })}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-400">Fuel Used (L)</label>
                  <input
                    type="number"
                    value={editingTrip.fuelUsed || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, fuelUsed: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm text-slate-400">Notes</label>
                <textarea
                  value={editingTrip.notes}
                  onChange={(e) => setEditingTrip({ ...editingTrip, notes: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Timeline Events */}
              <div className="rounded-xl bg-slate-900 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-300">Timeline Events</h3>
                
                {/* Existing Events */}
                <div className="mb-4 space-y-2">
                  {editingTrip.timeline?.map((event, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-lg bg-slate-800 p-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-cyan-400">{event.time}</div>
                        <div className="text-xs text-slate-300">{event.event}</div>
                      </div>
                      <button
                        onClick={() => handleEditTimelineEvent(index)}
                        className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400 transition-colors active:bg-cyan-500/30"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTimelineEvent(index)}
                        className="rounded-lg bg-red-500/20 p-2 text-red-400 transition-colors active:bg-red-500/30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Event Form */}
                <div className="space-y-3 rounded-lg bg-slate-800 p-3">
                  <div className="text-sm font-medium text-slate-300">
                    {editingTimelineIndex !== null ? 'Edit Event' : 'Add Event'}
                  </div>
                  <input
                    type="time"
                    value={timelineEventForm.time}
                    onChange={(e) => setTimelineEventForm({ ...timelineEventForm, time: e.target.value })}
                    placeholder="Time"
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="text"
                    value={timelineEventForm.event}
                    onChange={(e) => setTimelineEventForm({ ...timelineEventForm, event: e.target.value })}
                    placeholder="Event description"
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  {editingTimelineIndex !== null ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveTimelineEvent}
                        className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white transition-colors active:bg-green-600"
                      >
                        Save Event
                      </button>
                      <button
                        onClick={() => {
                          setEditingTimelineIndex(null);
                          setTimelineEventForm({ time: '', event: '' });
                        }}
                        className="flex-1 rounded-lg bg-slate-700 py-2 text-sm font-semibold text-white transition-colors active:bg-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddTimelineEvent}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 text-sm font-semibold text-white transition-colors active:bg-cyan-600"
                    >
                      <Plus className="size-4" />
                      Add Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-slate-800 p-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCancelEdit}
                className="rounded-xl bg-slate-800 py-3 font-semibold text-white transition-colors active:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrip}
                className="rounded-xl bg-cyan-500 py-3 font-semibold text-white transition-colors active:bg-cyan-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trip Details Screen
  const tripDate = new Date(trip.date);
  const seaConditionColor = 
    trip.weather?.seaCondition === 'Calm' ? 'text-green-400 bg-green-500/20' :
    trip.weather?.seaCondition === 'Moderate' ? 'text-yellow-400 bg-yellow-500/20' :
    'text-red-400 bg-red-500/20';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 pt-16">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-cyan-400 transition-colors active:text-cyan-300"
        >
          <ArrowLeft className="size-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-lg font-semibold text-white">Trip Details</h1>
        <div className="w-16"></div>
      </div>

      <div className="space-y-6 px-6 pb-24 pt-6">
        {/* Trip Header */}
        <div className="rounded-xl bg-slate-900 p-6">
          <h2 className="mb-4 font-semibold text-cyan-400">{trip.routeName}</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="size-4" />
                <span>Date</span>
              </div>
              <span className="font-medium">
                {tripDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {trip.departureTime && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="size-4" />
                  <span>Departure Time</span>
                </div>
                <span className="font-medium">{trip.departureTime}</span>
              </div>
            )}

            {trip.arrivalTime && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="size-4" />
                  <span>Arrival Time</span>
                </div>
                <span className="font-medium">{trip.arrivalTime}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="size-4" />
                <span>Duration</span>
              </div>
              <span className="font-medium">{trip.duration.toFixed(1)} hours</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Navigation className="size-4" />
                <span>Distance</span>
              </div>
              <span className="font-medium">{trip.distance} nm</span>
            </div>
          </div>
        </div>

        {/* Weather Conditions */}
        {trip.weather && (
          <div className="rounded-xl bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-slate-400">
                Weather Conditions
              </h3>
              <div className={`rounded-full px-3 py-1 text-xs font-medium ${seaConditionColor}`}>
                {trip.weather.seaCondition}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                <Wind className="size-5 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-400">Wind</div>
                  <div className="font-semibold">{trip.weather.wind} kts</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                <Waves className="size-5 text-cyan-400" />
                <div>
                  <div className="text-xs text-slate-400">Waves</div>
                  <div className="font-semibold">{trip.weather.waves} m</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                <Gauge className="size-5 text-orange-400" />
                <div>
                  <div className="text-xs text-slate-400">Pressure</div>
                  <div className="font-semibold">{trip.weather.pressure} hPa</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                <Thermometer className="size-5 text-red-400" />
                <div>
                  <div className="text-xs text-slate-400">Temp</div>
                  <div className="font-semibold">{trip.weather.temperature}°C</div>
                </div>
              </div>

              <div className="col-span-2 flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                <Eye className="size-5 text-purple-400" />
                <div>
                  <div className="text-xs text-slate-400">Visibility</div>
                  <div className="font-semibold">{trip.weather.visibility} km</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="rounded-xl bg-slate-900 p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            <FileText className="size-4" />
            <span>Notes</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{trip.notes}</p>
        </div>

        {/* Trip Statistics */}
        <div className="rounded-xl bg-slate-900 p-6">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
            Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {trip.avgSpeed && (
              <div className="rounded-lg bg-slate-800 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <Navigation className="size-4" />
                  <span>Avg Speed</span>
                </div>
                <div className="font-semibold">{trip.avgSpeed} kts</div>
              </div>
            )}

            {trip.maxSpeed && (
              <div className="rounded-lg bg-slate-800 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <Zap className="size-4" />
                  <span>Max Speed</span>
                </div>
                <div className="font-semibold">{trip.maxSpeed} kts</div>
              </div>
            )}

            {trip.fuelUsed && (
              <div className="rounded-lg bg-slate-800 p-4">
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                  <Fuel className="size-4" />
                  <span>Fuel Used</span>
                </div>
                <div className="font-semibold">{trip.fuelUsed} L</div>
              </div>
            )}

            <div className="rounded-lg bg-slate-800 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="size-4" />
                <span>Duration</span>
              </div>
              <div className="font-semibold">{trip.duration.toFixed(1)} h</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {trip.timeline && trip.timeline.length > 0 && (
          <div className="rounded-xl bg-slate-900 p-6">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
              Trip Timeline
            </h3>

            <div className="space-y-4">
              {trip.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500/20">
                      <div className="size-3 rounded-full bg-cyan-400"></div>
                    </div>
                    {index < trip.timeline!.length - 1 && (
                      <div className="my-1 w-0.5 flex-1 bg-slate-700"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium text-cyan-400">{item.time}</div>
                    <div className="mt-1 text-sm text-slate-300">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEditTrip}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500/20 py-4 font-semibold text-cyan-400 transition-colors active:bg-cyan-500/30"
          >
            <Edit className="size-5" />
            <span>Edit Trip</span>
          </button>
          
          <button
            onClick={handleDeleteTrip}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 py-4 font-semibold text-red-400 transition-colors active:bg-red-500/30"
          >
            <Trash2 className="size-5" />
            <span>Delete Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}