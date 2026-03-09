import { ArrowLeft, Users, Edit, Trash2, UserPlus, Trophy, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface TeamDetailsScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function TeamDetailsScreen({ onNavigate, onBack }: TeamDetailsScreenProps) {
  const { teams, selectedTeamId, getTeamMembers, deleteTeam, setSelectedMemberId } = useApp();
  
  const team = teams.find(t => t.id === selectedTeamId);
  const members = team ? getTeamMembers(team.id) : [];
  const activeMembers = members.filter(m => m.status === 'active');
  const captain = members.find(m => m.role === 'captain');

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white flex items-center justify-center">
        <p className="font-['Inter',sans-serif] text-gray-600">Team not found</p>
      </div>
    );
  }

  const handleDeleteTeam = () => {
    if (confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
      deleteTeam(team.id);
      onBack();
    }
  };

  const handleAddMember = () => {
    onNavigate('add-member');
  };

  const handleMemberClick = (memberId: number) => {
    setSelectedMemberId(memberId);
    onNavigate('edit-member');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#207DF0] to-[#3F6692] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Inter',sans-serif] font-black text-xl flex-1">
            {team.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 opacity-75" />
          <span className="font-['Inter',sans-serif] text-sm opacity-90">
            {team.country}
          </span>
          <span className="opacity-50">•</span>
          <span className="font-['Inter',sans-serif] text-sm opacity-90">
            {team.discipline}
          </span>
        </div>

        {team.description && (
          <p className="font-['Inter',sans-serif] text-sm opacity-90">
            {team.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-4">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-['Inter',sans-serif] text-xs font-semibold">
              {activeMembers.length} Member{activeMembers.length !== 1 ? 's' : ''}
            </span>
          </div>
          {captain && (
            <div className="bg-[#F0A720]/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span className="font-['Inter',sans-serif] text-xs font-semibold">
                Captain: {captain.fullName}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+100px)]">
        {/* Team Info Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Inter',sans-serif] font-bold text-lg text-gray-900">
              Team Information
            </h3>
            <button 
              onClick={() => onNavigate('edit-team')}
              className="text-[#207DF0] font-['Inter',sans-serif] text-sm font-medium"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Status</p>
              <p className="font-['Inter',sans-serif] text-sm text-gray-900">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  team.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {team.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>

            <div>
              <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">Created</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="font-['Inter',sans-serif] text-sm text-gray-900">
                  {new Date(team.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Inter',sans-serif] font-bold text-lg text-gray-900">
              Roster ({members.length})
            </h3>
          </div>

          {members.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-[#207DF0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-[#207DF0]" />
              </div>
              <h4 className="font-['Inter',sans-serif] font-bold text-gray-900 mb-2">
                No Members Yet
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-gray-600 mb-4">
                Start building your roster by adding team members
              </p>
              <Button variant="accent1" fullWidth onClick={handleAddMember}>
                <UserPlus className="w-5 h-5 mr-2" />
                Add First Member
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleMemberClick(member.id)}
                  className="w-full bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        member.role === 'captain' 
                          ? 'bg-gradient-to-br from-[#F0A720] to-[#F0A720]/80'
                          : 'bg-gradient-to-br from-[#207DF0] to-[#3F6692]'
                      }`}>
                        {member.role === 'captain' ? (
                          <Trophy className="w-6 h-6 text-white" />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Inter',sans-serif] font-bold text-gray-900">
                            {member.fullName}
                          </h4>
                          {member.role === 'captain' && (
                            <span className="bg-[#F0A720]/10 text-[#F0A720] text-xs px-2 py-0.5 rounded-full font-['Inter',sans-serif] font-semibold">
                              Captain
                            </span>
                          )}
                          {member.role === 'reserve' && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-['Inter',sans-serif] font-semibold">
                              Reserve
                            </span>
                          )}
                        </div>
                        <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                          {member.country} • {member.primaryDiscipline}
                        </p>
                        {member.status === 'inactive' && (
                          <span className="inline-block mt-1 text-xs text-gray-500 italic">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-['Inter',sans-serif] font-bold text-red-900 mb-2">
            Danger Zone
          </h4>
          <p className="font-['Inter',sans-serif] text-sm text-red-700 mb-3">
            Deleting a team is permanent and cannot be undone.
          </p>
          <button
            onClick={handleDeleteTeam}
            className="flex items-center gap-2 text-red-600 font-['Inter',sans-serif] text-sm font-semibold hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete Team
          </button>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 bg-white py-4 border-t border-gray-200 pb-[30px]">
        <Button variant="accent1" fullWidth onClick={handleAddMember}>
          <div className="flex items-center justify-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Member
          </div>
        </Button>
      </div>
    </div>
  );
}