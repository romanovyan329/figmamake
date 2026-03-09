import { ArrowLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function RegisterScreen({ onNavigate, onBack }: RegisterScreenProps) {
  const { selectedTournamentId, tournaments, addToSeason, userProfile, teams } = useApp();
  const tournament = tournaments.find(t => t.id === selectedTournamentId);

  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [team, setTeam] = useState('');
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');

  if (!tournament) {
    return null;
  }

  const handleConfirm = () => {
    if (!userProfile) return;
    
    // Get team name from selected team or manual input
    const teamName = selectedTeamId 
      ? teams.find(t => t.id === selectedTeamId)?.name 
      : team;
    
    addToSeason({
      tournamentId: tournament.id,
      participationType,
      team: participationType === 'team' ? teamName : undefined,
      goal,
      notes
    });
    onNavigate('calendar');
  };

  const handleTeamSelection = (teamId: number) => {
    setSelectedTeamId(teamId);
    const selectedTeam = teams.find(t => t.id === teamId);
    if (selectedTeam) {
      setTeam(selectedTeam.name);
    }
  };

  // Show "Create Profile First" screen if no profile
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
        {/* Header */}
        <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
              Add to Season
            </h1>
          </div>
          <p className="font-['Inter',sans-serif] text-sm opacity-90">
            {tournament.title}
          </p>
        </div>

        <div className="px-4 mt-12 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#F0A720]/10 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-12 h-12 text-[#F0A720]" />
          </div>
          
          <h2 className="font-['Figtree',sans-serif] font-black text-2xl text-gray-900 mb-3 text-center">
            Profile Required
          </h2>
          
          <p className="font-['Inter',sans-serif] text-center text-gray-600 mb-8 max-w-sm">
            To register for tournaments and track your career progress, you need to create your athlete profile first.
          </p>

          <div className="w-full max-w-sm space-y-3">
            <Button variant="accent1" fullWidth onClick={() => onNavigate('create-profile')}>
              Create Profile
            </Button>
            <button
              onClick={onBack}
              className="w-full py-3 font-['Figtree',sans-serif] font-bold text-[#207DF0] text-sm"
            >
              Back to Tournament
            </button>
          </div>

          <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-sm">
            <h3 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
              📌 What you'll get:
            </h3>
            <ul className="font-['Inter',sans-serif] text-sm text-gray-700 space-y-1">
              <li>• Register for tournaments</li>
              <li>• Track results and statistics</li>
              <li>• Build your career history</li>
              <li>• Analyze performance by discipline</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Add to Season
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90">
          {tournament.title}
        </p>
      </div>

      <div className="px-4 mt-6 pb-[calc(100px)]">
        {/* Participation Type */}
        <div className="mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
            Participation Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setParticipationType('individual')}
              className={`p-4 rounded-xl font-['Figtree',sans-serif] font-bold transition-colors ${
                participationType === 'individual'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setParticipationType('team')}
              className={`p-4 rounded-xl font-['Figtree',sans-serif] font-bold transition-colors ${
                participationType === 'team'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Team
            </button>
          </div>
        </div>

        {/* Team Selection (if team) */}
        {participationType === 'team' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
                Team
              </h3>
              {teams.length > 0 && (
                <button
                  onClick={() => onNavigate('my-teams')}
                  className="text-[#207DF0] font-['Inter',sans-serif] text-sm font-semibold"
                >
                  Manage Teams
                </button>
              )}
            </div>
            
            {teams.length > 0 ? (
              <>
                <select
                  value={selectedTeamId || 'manual'}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'manual') {
                      setSelectedTeamId(null);
                      setTeam('');
                    } else {
                      handleTeamSelection(Number(value));
                    }
                  }}
                  className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] mb-3"
                >
                  <option value="manual">Enter new team name...</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.discipline})
                    </option>
                  ))}
                </select>
                
                {!selectedTeamId && (
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="Enter team name"
                    className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0]"
                  />
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] mb-3"
                />
                <button
                  onClick={() => onNavigate('my-teams')}
                  className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
                >
                  Or create a team in My Teams section
                </button>
              </>
            )}
          </div>
        )}

        {/* Goal */}
        <div className="mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
            Goal <span className="text-gray-400 font-normal text-sm">(Optional)</span>
          </h3>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Top 10 finish"
            className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0]"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
            Notes <span className="text-gray-400 font-normal text-sm">(Optional)</span>
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Preparation notes, strategy, equipment..."
            rows={4}
            className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] resize-none"
          />
        </div>

        {/* Tournament Info Summary */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-3">
            Tournament Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Date</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {tournament.date}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Location</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {tournament.location}, {tournament.country}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-['Inter',sans-serif] text-sm text-gray-600">Entry Fee</span>
              <span className="font-['Inter',sans-serif] text-sm text-gray-900 font-semibold">
                {tournament.entryFee}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 bg-white pt-4 pb-8 border-t border-gray-200">
        <Button variant="accent1" fullWidth onClick={handleConfirm}>
          Confirm Participation
        </Button>
      </div>
    </div>
  );
}