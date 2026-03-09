import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

interface EditTeamScreenProps {
  onBack: () => void;
}

export function EditTeamScreen({ onBack }: EditTeamScreenProps) {
  const { teams, selectedTeamId, updateTeam } = useApp();
  
  const team = teams.find(t => t.id === selectedTeamId);

  const [teamName, setTeamName] = useState(team?.name || '');
  const [country, setCountry] = useState(team?.country || '');
  const [discipline, setDiscipline] = useState(team?.discipline || '');
  const [description, setDescription] = useState(team?.description || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(team?.status || 'active');

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white flex items-center justify-center">
        <p className="font-['Inter',sans-serif] text-gray-600">Team not found</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    if (!country.trim()) {
      alert('Please select a country');
      return;
    }

    if (!discipline.trim()) {
      alert('Please select a discipline');
      return;
    }

    updateTeam(team.id, {
      name: teamName.trim(),
      country: country.trim(),
      discipline: discipline.trim(),
      description: description.trim(),
      status,
    });

    onBack();
  };

  const countries = [
    'Austria', 'Belgium', 'Croatia', 'Czech Republic', 'Denmark',
    'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain',
    'Sweden', 'Switzerland', 'United Kingdom'
  ];

  const disciplines = [
    'Feeder Fishing',
    'Carp Fishing',
    'Match Fishing',
    'Spinning',
    'Fly Fishing',
    'Predator Fishing',
    'Float Fishing',
    'Multi-discipline'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Inter',sans-serif] font-black text-2xl">
            Edit Team
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-6 pb-[calc(30px+80px)]">
        {/* Team Name */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] font-bold text-gray-900 mb-2">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g., Team Dynamite"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-['Inter',sans-serif] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#207DF0] focus:border-transparent"
          />
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] font-bold text-gray-900 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-['Inter',sans-serif] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#207DF0] focus:border-transparent"
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Discipline */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] font-bold text-gray-900 mb-2">
            Discipline <span className="text-red-500">*</span>
          </label>
          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-['Inter',sans-serif] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#207DF0] focus:border-transparent"
          >
            <option value="">Select Discipline</option>
            {disciplines.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] font-bold text-gray-900 mb-2">
            Description <span className="text-gray-400 font-normal text-sm">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add team description, goals, or any other information..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-['Inter',sans-serif] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#207DF0] focus:border-transparent resize-none"
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block font-['Inter',sans-serif] font-bold text-gray-900 mb-3">
            Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus('active')}
              className={`p-4 rounded-xl font-['Inter',sans-serif] font-bold transition-colors ${
                status === 'active'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatus('inactive')}
              className={`p-4 rounded-xl font-['Inter',sans-serif] font-bold transition-colors ${
                status === 'inactive'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="space-y-3">
          <Button variant="accent1" fullWidth>
            Save Changes
          </Button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 font-['Inter',sans-serif] font-bold text-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
