import { ArrowLeft, User, MapPin, Trophy, FileText, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface EditMemberScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function EditMemberScreen({ onNavigate, onBack }: EditMemberScreenProps) {
  const { selectedMemberId, teamMembers, updateTeamMember, deleteTeamMember } = useApp();
  const member = teamMembers.find(m => m.id === selectedMemberId);

  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    primaryDiscipline: 'Feeder',
    role: 'angler' as 'captain' | 'angler' | 'reserve',
    status: 'active' as 'active' | 'inactive',
    notes: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        country: member.country,
        primaryDiscipline: member.primaryDiscipline,
        role: member.role,
        status: member.status,
        notes: member.notes || ''
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.country || !selectedMemberId) {
      alert('Please fill in all required fields');
      return;
    }

    updateTeamMember(selectedMemberId, {
      fullName: formData.fullName,
      country: formData.country,
      primaryDiscipline: formData.primaryDiscipline,
      role: formData.role,
      status: formData.status,
      notes: formData.notes
    });

    onBack();
  };

  const handleDelete = () => {
    if (!selectedMemberId) return;
    
    if (confirm(`Are you sure you want to remove ${formData.fullName} from the team?`)) {
      deleteTeamMember(selectedMemberId);
      onBack();
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white flex items-center justify-center">
        <p className="font-['Inter',sans-serif] text-gray-600">Member not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Edit Member
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90 pl-10">
          Update member information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 mt-6 pb-[calc(30px+100px)]">
        {/* Full Name */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter member's full name"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-['Inter',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#207DF0]"
              required
            />
          </div>
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Country *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-['Inter',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#207DF0] appearance-none bg-white"
              required
            >
              <option value="">Select country</option>
              <option value="Poland">Poland</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="Austria">Austria</option>
              <option value="Sweden">Sweden</option>
              <option value="Norway">Norway</option>
              <option value="Finland">Finland</option>
              <option value="Denmark">Denmark</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Ireland">Ireland</option>
            </select>
          </div>
        </div>

        {/* Primary Discipline */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Primary Discipline *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Trophy className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={formData.primaryDiscipline}
              onChange={(e) => setFormData({ ...formData, primaryDiscipline: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-['Inter',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#207DF0] appearance-none bg-white"
              required
            >
              <option value="Feeder">Feeder</option>
              <option value="Float">Float</option>
              <option value="Carp">Carp</option>
              <option value="Match">Match</option>
              <option value="Pole">Pole</option>
            </select>
          </div>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Team Role *
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="captain"
                checked={formData.role === 'captain'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'captain' | 'angler' | 'reserve' })}
                className="w-4 h-4 text-[#207DF0]"
              />
              <span className="ml-3 font-['Inter',sans-serif] text-sm text-gray-900">
                <span className="font-semibold">Captain</span> - Team leader and strategist
              </span>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="angler"
                checked={formData.role === 'angler'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'captain' | 'angler' | 'reserve' })}
                className="w-4 h-4 text-[#207DF0]"
              />
              <span className="ml-3 font-['Inter',sans-serif] text-sm text-gray-900">
                <span className="font-semibold">Angler</span> - Active team member
              </span>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="role"
                value="reserve"
                checked={formData.role === 'reserve'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'captain' | 'angler' | 'reserve' })}
                className="w-4 h-4 text-[#207DF0]"
              />
              <span className="ml-3 font-['Inter',sans-serif] text-sm text-gray-900">
                <span className="font-semibold">Reserve</span> - Backup member
              </span>
            </label>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Status *
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-4 h-4 text-[#207DF0]"
              />
              <span className="ml-3 font-['Inter',sans-serif] text-sm text-gray-900">
                <span className="font-semibold">Active</span> - Currently on roster
              </span>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-4 h-4 text-[#207DF0]"
              />
              <span className="ml-3 font-['Inter',sans-serif] text-sm text-gray-900">
                <span className="font-semibold">Inactive</span> - Not currently participating
              </span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Specializations, strengths, or other notes..."
              rows={4}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg font-['Inter',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#207DF0] resize-none"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h4 className="font-['Figtree',sans-serif] font-bold text-red-900 mb-2">
            Remove Member
          </h4>
          <p className="font-['Inter',sans-serif] text-sm text-red-700 mb-3">
            Removing a member will permanently delete them from the team.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 font-['Inter',sans-serif] text-sm font-semibold hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Remove from Team
          </button>
        </div>
      </form>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-[30px] left-0 right-0 px-4 bg-white py-4 border-t border-gray-200">
        <Button 
          variant="accent1" 
          fullWidth 
          onClick={handleSubmit}
          disabled={!formData.fullName || !formData.country}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
