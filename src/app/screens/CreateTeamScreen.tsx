import { ArrowLeft, Users, MapPin, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface CreateTeamScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function CreateTeamScreen({ onNavigate, onBack }: CreateTeamScreenProps) {
  const { createTeam } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    discipline: 'Feeder',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }

    createTeam({
      name: formData.name,
      country: formData.country,
      discipline: formData.discipline,
      description: formData.description,
      status: 'active'
    });

    onBack();
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
            Create Team
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90 pl-10">
          Set up your new team
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 mt-6 pb-[calc(30px+100px)]">
        {/* Team Name */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Team Name *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter team name"
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

        {/* Discipline */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Primary Discipline *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Trophy className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={formData.discipline}
              onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
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

        {/* Description */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] text-sm font-semibold text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Team goals, philosophy, or other notes..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-['Inter',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#207DF0] resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
            💡 Next Steps
          </h4>
          <p className="font-['Inter',sans-serif] text-sm text-gray-700">
            After creating your team, you'll be able to add members and manage the roster.
          </p>
        </div>
      </form>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-[30px] left-0 right-0 px-4 bg-white py-4 border-t border-gray-200">
        <Button 
          variant="accent1" 
          fullWidth 
          onClick={handleSubmit}
          disabled={!formData.name || !formData.country}
        >
          Create Team
        </Button>
      </div>
    </div>
  );
}
