import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, 
  MapPin, 
  Info,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Anchor,
  X
} from 'lucide-react';
import { tournaments as allTournaments, userTournaments, tournamentResults, athleteProfiles } from '../data/mockData';
import type { Tournament } from '../data/mockData';

// Types
type SportType = 'Fishing' | 'Sailing' | 'Wake' | 'Jet Ski' | 'Surf' | 'Kayak' | 'Water Ski';
type EquipmentType = 'Boat' | 'Jet Ski' | 'Surfboard' | 'Kayak' | 'Fishing Gear' | 'Other';
type MaintenanceStatus = 'Overdue' | 'Upcoming' | 'Done';

interface UserProfile {
  name: string;
  avatar?: string;
  location?: string;
  sports: SportType[];
}

interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  specs?: {
    length?: number;
    power?: number;
    model?: string;
    year?: number;
  };
}

interface MaintenanceItem {
  id: string;
  title: string;
  equipmentId: string;
  equipmentName: string;
  dueDate: string;
  status: MaintenanceStatus;
  notes?: string;
}

interface TournamentEntry {
  id: string;
  name: string;
  sport: SportType;
  date: string;
  status: 'registered' | 'completed';
  rank?: number;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const currentUserId = '1';
  
  // Load profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
    return {
      name: 'Alex Morrison',
      location: 'Odessa, Ukraine',
      sports: ['Fishing', 'Sailing', 'Wake']
    };
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  // Load completed tournaments from My Season with results
  const [completedTournaments, setCompletedTournaments] = useState<Array<{
    tournament: Tournament;
    rank?: number;
  }>>([]);

  useEffect(() => {
    const loadCompletedTournaments = () => {
      // Get user's registered tournaments from localStorage or default
      const savedTournaments = localStorage.getItem('userTournaments');
      const allUserTournaments = savedTournaments ? JSON.parse(savedTournaments) : userTournaments;
      
      // Get tournaments where user is registered
      const myTournamentIds = allUserTournaments
        .filter((ut: any) => ut.userId === currentUserId && ut.status === 'registered')
        .map((ut: any) => ut.tournamentId);
      
      // Filter only finished tournaments
      const finishedTournaments = allTournaments
        .filter(t => myTournamentIds.includes(t.id) && t.status === 'finished')
        .map(tournament => {
          // Get user's rank in this tournament
          const result = tournamentResults.find(
            r => r.tournamentId === tournament.id && r.userId === currentUserId
          );
          return {
            tournament,
            rank: result?.rank
          };
        });
      
      setCompletedTournaments(finishedTournaments);
    };

    loadCompletedTournaments();

    // Listen for changes when user returns to the page
    const handleFocus = () => loadCompletedTournaments();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUserId]);

  // Load equipment from localStorage
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('userEquipment');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load equipment:', e);
      }
    }
    return [
      {
        id: '1',
        name: 'Sea Wanderer',
        type: 'Boat',
        specs: {
          length: 32,
          model: 'Motor Yacht',
          year: 2019
        }
      },
      {
        id: '2',
        name: 'Yamaha FX Cruiser',
        type: 'Jet Ski',
        specs: {
          power: 180,
          model: 'FX Cruiser SVHO',
          year: 2021
        }
      }
    ];
  });

  // Save equipment to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userEquipment', JSON.stringify(equipment));
  }, [equipment]);

  // Load maintenance from localStorage
  const [maintenance, setMaintenance] = useState<MaintenanceItem[]>(() => {
    const saved = localStorage.getItem('userMaintenance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load maintenance:', e);
      }
    }
    return [
      {
        id: '1',
        title: 'Engine Oil Change',
        equipmentId: '1',
        equipmentName: 'Sea Wanderer',
        dueDate: '2026-04-15',
        status: 'Upcoming',
        notes: 'Replace oil filter too'
      },
      {
        id: '2',
        title: 'Jet Ski Service',
        equipmentId: '2',
        equipmentName: 'Yamaha FX Cruiser',
        dueDate: '2026-03-20',
        status: 'Overdue',
        notes: 'Check spark plugs'
      },
      {
        id: '3',
        title: 'Hull Cleaning',
        equipmentId: '1',
        equipmentName: 'Sea Wanderer',
        dueDate: '2026-05-01',
        status: 'Upcoming'
      }
    ];
  });

  // Save maintenance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userMaintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  // Load user stats from localStorage
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    // Return default mock stats
    return {
      totalSessions: 47,
      totalDistance: 523,
      tournaments: 12,
      wins: 3
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: profile.name,
    location: profile.location || '',
    sports: profile.sports
  });

  // Equipment form state
  const [equipmentForm, setEquipmentForm] = useState<Equipment>({
    id: '',
    name: '',
    type: 'Boat',
    specs: {}
  });
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);

  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceItem>({
    id: '',
    title: '',
    equipmentId: '',
    equipmentName: '',
    dueDate: '',
    status: 'Upcoming',
    notes: ''
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getMaintenanceStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Overdue': return 'text-red-400';
      case 'Upcoming': return 'text-yellow-400';
      case 'Done': return 'text-green-400';
    }
  };

  const getMaintenanceIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Overdue': return AlertCircle;
      case 'Upcoming': return Calendar;
      case 'Done': return CheckCircle2;
    }
  };

  const getSportIcon = (sport: SportType) => {
    switch (sport) {
      case 'Fishing': return '🎣';
      case 'Sailing': return '⛵';
      case 'Wake': return '🏄';
      case 'Jet Ski': return '🚤';
      case 'Surf': return '🏄‍♂️';
      case 'Kayak': return '🛶';
      case 'Water Ski': return '🎿';
      default: return '🌊';
    }
  };

  const allSports: SportType[] = ['Fishing', 'Sailing', 'Wake', 'Jet Ski', 'Surf', 'Kayak', 'Water Ski'];

  const handleSaveProfile = () => {
    setProfile({
      name: editForm.name,
      location: editForm.location,
      sports: editForm.sports
    });
    setShowEditProfile(false);
  };

  const toggleSport = (sport: SportType) => {
    if (editForm.sports.includes(sport)) {
      setEditForm({ ...editForm, sports: editForm.sports.filter(s => s !== sport) });
    } else {
      setEditForm({ ...editForm, sports: [...editForm.sports, sport] });
    }
  };

  // Equipment handlers
  const handleAddEquipment = () => {
    setEquipmentForm({
      id: '',
      name: '',
      type: 'Boat',
      specs: {}
    });
    setEditingEquipmentId(null);
    setShowAddEquipment(true);
  };

  const handleEditEquipment = (item: Equipment) => {
    setEquipmentForm(item);
    setEditingEquipmentId(item.id);
    setShowAddEquipment(true);
  };

  const handleSaveEquipment = () => {
    if (editingEquipmentId) {
      // Edit existing
      setEquipment(equipment.map(e => e.id === editingEquipmentId ? { ...equipmentForm, id: editingEquipmentId } : e));
    } else {
      // Add new
      const newEquipment = { ...equipmentForm, id: Date.now().toString() };
      setEquipment([...equipment, newEquipment]);
    }
    setShowAddEquipment(false);
  };

  const handleDeleteEquipment = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(equipment.filter(e => e.id !== id));
      // Also delete related maintenance items
      setMaintenance(maintenance.filter(m => m.equipmentId !== id));
    }
  };

  // Maintenance handlers
  const handleAddMaintenance = () => {
    setMaintenanceForm({
      id: '',
      title: '',
      equipmentId: equipment[0]?.id || '',
      equipmentName: equipment[0]?.name || '',
      dueDate: '',
      status: 'Upcoming',
      notes: ''
    });
    setEditingMaintenanceId(null);
    setShowAddMaintenance(true);
  };

  const handleEditMaintenance = (item: MaintenanceItem) => {
    setMaintenanceForm(item);
    setEditingMaintenanceId(item.id);
    setShowAddMaintenance(true);
  };

  const handleSaveMaintenance = () => {
    const selectedEquipment = equipment.find(e => e.id === maintenanceForm.equipmentId);
    const updatedItem = {
      ...maintenanceForm,
      equipmentName: selectedEquipment?.name || ''
    };

    if (editingMaintenanceId) {
      // Edit existing
      setMaintenance(maintenance.map(m => m.id === editingMaintenanceId ? { ...updatedItem, id: editingMaintenanceId } : m));
    } else {
      // Add new
      const newMaintenance = { ...updatedItem, id: Date.now().toString() };
      setMaintenance([...maintenance, newMaintenance]);
    }
    setShowAddMaintenance(false);
  };

  const handleDeleteMaintenance = (id: string) => {
    if (confirm('Are you sure you want to delete this maintenance item?')) {
      setMaintenance(maintenance.filter(m => m.id !== id));
    }
  };

  // Delete all profile data
  const handleDeleteAllData = () => {
    if (confirm('⚠️ WARNING: This will permanently delete ALL your data including profile, equipment, maintenance, tournament registrations, and map markers. This action cannot be undone. Are you sure?')) {
      if (confirm('This is your final confirmation. Delete everything?')) {
        // Reset profile
        const emptyProfile = {
          name: 'User',
          location: '',
          sports: []
        };
        setProfile(emptyProfile);
        setEditForm(emptyProfile);

        // Clear stats
        const emptyStats = {
          totalSessions: 0,
          totalDistance: 0,
          tournaments: 0,
          wins: 0
        };
        setStats(emptyStats);

        // Clear equipment
        setEquipment([]);

        // Clear maintenance
        setMaintenance([]);

        // Clear completed tournaments
        setCompletedTournaments([]);

        // Clear all localStorage data
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userStats');
        localStorage.removeItem('userEquipment');
        localStorage.removeItem('userMaintenance');
        localStorage.removeItem('userTournaments');
        localStorage.removeItem('userSeasonStats');
        localStorage.removeItem('mapPoints');
        localStorage.removeItem('savedPoints');
        localStorage.removeItem('savedRoutes');
        localStorage.removeItem('activeRoute');

        // Close modal
        setShowEditProfile(false);

        // Show confirmation
        alert('✅ All data has been deleted successfully. Page will reload.');
        
        // Reload page to ensure all components are reset
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-950 text-white pb-24">
      <div className="px-6 pt-16 pb-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <User className="size-8" />
            </div>
            
            {/* Name & Location */}
            <div>
              <h1 className="text-xl font-semibold text-white">{profile.name}</h1>
              {profile.location && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin className="size-3.5" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {/* Sports Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.sports.map((sport) => (
                  <div
                    key={sport}
                    className="flex items-center gap-1.5 rounded-full bg-slate-800/50 px-3 py-1 text-xs text-cyan-400"
                  >
                    <span>{getSportIcon(sport)}</span>
                    <span>{sport}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Icon */}
          <button 
            onClick={() => navigate('/about')}
            className="rounded-full bg-slate-800/50 p-2 transition-colors active:bg-slate-700"
          >
            <Info className="size-5 text-slate-400" />
          </button>
        </div>

        {/* Edit Profile Button */}
        <button 
          onClick={() => {
            setEditForm({
              name: profile.name,
              location: profile.location || '',
              sports: profile.sports
            });
            setShowEditProfile(true);
          }}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-medium text-white transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-2">
            <Edit2 className="size-4" />
            <span>Edit Profile</span>
          </div>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-3 text-center">
            <div className="text-xl font-bold text-white">{stats.totalSessions}</div>
            <div className="mt-0.5 text-xs text-slate-400">Sessions</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">{stats.totalDistance}</div>
            <div className="mt-0.5 text-xs text-slate-400">km</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-3 text-center">
            <div className="text-xl font-bold text-white">{stats.tournaments}</div>
            <div className="mt-0.5 text-xs text-slate-400">Events</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">{stats.wins}</div>
            <div className="mt-0.5 text-xs text-slate-400">Wins</div>
          </div>
        </div>

        {/* My Equipment */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-white">My Equipment</h2>
            <button
              onClick={handleAddEquipment}
              className="flex items-center gap-1 text-sm text-cyan-400 transition-colors active:text-cyan-300"
            >
              <Plus className="size-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3">
            {equipment.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Anchor className="size-4 text-cyan-400" />
                      <h3 className="font-medium text-white">{item.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{item.type}</p>
                    
                    {item.specs && (
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        {item.specs.length && (
                          <span>{item.specs.length} ft</span>
                        )}
                        {item.specs.power && (
                          <span>{item.specs.power} HP</span>
                        )}
                        {item.specs.model && (
                          <span>{item.specs.model}</span>
                        )}
                        {item.specs.year && (
                          <span>{item.specs.year}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditEquipment(item)}
                      className="rounded-lg bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
                    >
                      <Edit2 className="size-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(item.id)}
                      className="rounded-lg bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
                    >
                      <Trash2 className="size-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Care & Maintenance */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-white">Care & Maintenance</h2>
            <button
              onClick={handleAddMaintenance}
              className="flex items-center gap-1 text-sm text-cyan-400 transition-colors active:text-cyan-300"
            >
              <Plus className="size-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {maintenance.map((item) => {
              const StatusIcon = getMaintenanceIcon(item.status);
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-4"
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`size-5 ${getMaintenanceStatusColor(item.status)}`} />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-400">{item.equipmentName}</p>
                      
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>Due: {formatDate(item.dueDate)}</span>
                        <span className={getMaintenanceStatusColor(item.status)}>
                          {item.status}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="mt-2 text-xs text-slate-500">{item.notes}</p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditMaintenance(item)}
                        className="rounded-lg bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
                      >
                        <Edit2 className="size-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaintenance(item.id)}
                        className="rounded-lg bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Competitions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-white">My Competitions</h2>
            <button 
              onClick={() => navigate('/season')}
              className="flex items-center gap-1 text-sm text-cyan-400 transition-colors active:text-cyan-300"
            >
              <span>View All</span>
              <ChevronRight className="size-4" />
            </button>
          </div>

          {completedTournaments.length === 0 ? (
            <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-8 text-center">
              <Trophy className="mx-auto size-10 text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">No completed tournaments yet</p>
              <p className="text-xs text-slate-500 mt-1">Finish your first tournament to see results here</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedTournaments.map(({ tournament, rank }) => (
                <button
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`, { state: { from: '/profile' } })}
                  className="w-full rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-4 text-left transition-colors active:bg-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                      <Trophy className="size-5 text-cyan-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{tournament.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>{getSportIcon(tournament.sportType as SportType)} {tournament.sportType}</span>
                        <span>•</span>
                        <span>{formatDate(tournament.dateStart)}</span>
                      </div>
                      
                      <div className="mt-2">
                        {rank && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                            rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                            rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                            rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            #{rank} Place
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="size-5 text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="rounded-full bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
              >
                <X className="size-4 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-slate-400">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Sports</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {allSports.map((sport) => (
                    <div
                      key={sport}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                        editForm.sports.includes(sport) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/50 text-cyan-400'
                      }`}
                      onClick={() => toggleSport(sport)}
                    >
                      <span>{getSportIcon(sport)}</span>
                      <span>{sport}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-medium text-white transition-transform active:scale-[0.98]"
              >
                Save
              </button>
            </div>

            {/* Delete All Data Section */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Permanently delete all your data including profile, equipment, maintenance, tournaments, and map markers.
                </p>
              </div>
              <button
                onClick={handleDeleteAllData}
                className="w-full rounded-xl bg-red-600/20 border border-red-500/30 px-4 py-3 font-medium text-red-400 transition-colors active:bg-red-600/30"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash2 className="size-4" />
                  <span>Delete All Data</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Equipment Modal */}
      {showAddEquipment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingEquipmentId ? 'Edit Equipment' : 'Add Equipment'}
              </h2>
              <button
                onClick={() => setShowAddEquipment(false)}
                className="rounded-full bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
              >
                <X className="size-4 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-slate-400">Name</label>
                <input
                  type="text"
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Type</label>
                <select
                  value={equipmentForm.type}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.target.value as EquipmentType })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                >
                  <option value="Boat">Boat</option>
                  <option value="Jet Ski">Jet Ski</option>
                  <option value="Surfboard">Surfboard</option>
                  <option value="Kayak">Kayak</option>
                  <option value="Fishing Gear">Fishing Gear</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400">Length (ft)</label>
                <input
                  type="number"
                  value={equipmentForm.specs?.length || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, specs: { ...equipmentForm.specs, length: e.target.value ? parseFloat(e.target.value) : undefined } })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Power (HP)</label>
                <input
                  type="number"
                  value={equipmentForm.specs?.power || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, specs: { ...equipmentForm.specs, power: e.target.value ? parseFloat(e.target.value) : undefined } })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Model</label>
                <input
                  type="text"
                  value={equipmentForm.specs?.model || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, specs: { ...equipmentForm.specs, model: e.target.value } })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Year</label>
                <input
                  type="number"
                  value={equipmentForm.specs?.year || ''}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, specs: { ...equipmentForm.specs, year: e.target.value ? parseInt(e.target.value) : undefined } })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveEquipment}
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-medium text-white transition-transform active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Maintenance Modal */}
      {showAddMaintenance && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingMaintenanceId ? 'Edit Maintenance' : 'Add Maintenance'}
              </h2>
              <button
                onClick={() => setShowAddMaintenance(false)}
                className="rounded-full bg-slate-700/50 p-2 transition-colors active:bg-slate-700"
              >
                <X className="size-4 text-slate-400" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-slate-400">Title</label>
                <input
                  type="text"
                  value={maintenanceForm.title}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Equipment</label>
                <select
                  value={maintenanceForm.equipmentId}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, equipmentId: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                >
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400">Due Date</label>
                <input
                  type="date"
                  value={maintenanceForm.dueDate}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, dueDate: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400">Status</label>
                <select
                  value={maintenanceForm.status}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, status: e.target.value as MaintenanceStatus })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                >
                  <option value="Overdue">Overdue</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400">Notes</label>
                <textarea
                  value={maintenanceForm.notes || ''}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl bg-slate-700/50 px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveMaintenance}
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-medium text-white transition-transform active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}