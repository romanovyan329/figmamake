import { ArrowLeft, Users, Plus, Edit, ChevronRight, Trophy, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface MyTeamsScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function MyTeamsScreen({ onNavigate, onBack }: MyTeamsScreenProps) {
  const { teams, getTeamMembers, setSelectedTeamId } = useApp();

  const handleTeamClick = (teamId: number) => {
    setSelectedTeamId(teamId);
    onNavigate('team-details');
  };

  const handleCreateTeam = () => {
    onNavigate('create-team');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            My Teams
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90 pl-10">
          Manage your teams and rosters
        </p>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+100px)]">
        {teams.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="w-24 h-24 bg-[#207DF0]/10 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-[#207DF0]" />
            </div>
            
            <h2 className="font-['Figtree',sans-serif] font-black text-2xl text-gray-900 mb-3 text-center">
              No Teams Yet
            </h2>
            
            <p className="font-['Inter',sans-serif] text-center text-gray-600 mb-8 max-w-sm">
              Create your first team to participate in team tournaments and manage your roster.
            </p>

            <div className="w-full max-w-sm">
              <Button variant="accent1" fullWidth onClick={handleCreateTeam}>
                <Plus className="w-5 h-5 mr-2" />
                Create Team
              </Button>
            </div>
          </div>
        ) : (
          // Teams list
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
                Your Teams ({teams.length})
              </h3>
            </div>

            <div className="space-y-3">
              {teams.map(team => {
                const members = getTeamMembers(team.id);
                const activeMembers = members.filter(m => m.status === 'active');
                const captain = members.find(m => m.role === 'captain');

                return (
                  <button
                    key={team.id}
                    onClick={() => handleTeamClick(team.id)}
                    className="w-full bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#207DF0] to-[#3F6692] rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                              {team.name}
                            </h3>
                            <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                              {team.country} • {team.discipline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-4 h-4 text-gray-500" />
                            <span className="font-['Inter',sans-serif] text-sm text-gray-600">
                              {activeMembers.length} member{activeMembers.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {captain && (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-[#F0A720]" />
                              <span className="font-['Inter',sans-serif] text-sm text-gray-600">
                                {captain.fullName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {teams.length > 0 && (
        <div className="fixed bottom-[30px] left-0 right-0 px-4 bg-white py-4 border-t border-gray-200">
          <Button variant="accent1" fullWidth onClick={handleCreateTeam}>
            <Plus className="w-5 h-5 mr-2" />
            Create New Team
          </Button>
        </div>
      )}
    </div>
  );
}
