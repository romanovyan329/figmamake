import { ArrowLeft, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { TournamentFilters } from '../types/tournament';

interface FilterScreenProps {
  onBack: () => void;
  onApply: (filters: TournamentFilters) => void;
}

const allCountries = [
  'Poland', 'Italy', 'Germany', 'Czech Republic', 'France',
  'Spain', 'Netherlands', 'Belgium', 'Austria', 'Latvia',
  'Lithuania', 'Estonia', 'Hungary', 'Romania', 'Bulgaria',
  'Sweden', 'Finland', 'Denmark', 'Norway', 'Switzerland'
];

const disciplines = ['Feeder', 'Match Fishing', 'Float', 'Carp', 'Spinning', 'Fly Fishing'];
const levels = ['Amateur', 'Regional', 'National', 'International', 'Championship', 'Pro Series'];
const formats = ['Individual', 'Team'];
const statuses = ['Registration Open', 'Upcoming', 'Closed'];

export function FilterScreen({ onBack, onApply }: FilterScreenProps) {
  const { tournaments, userProfile } = useApp();

  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [prizeMin, setPrizeMin] = useState(0);
  const [prizeMax, setPrizeMax] = useState(50000);
  const [datePreset, setDatePreset] = useState<string>('all');
  
  // UI states
  const [countrySearch, setCountrySearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredCountries = allCountries.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Calculate filtered tournaments count
  const filteredCount = useMemo(() => {
    return tournaments.filter(t => {
      // Country filter
      if (selectedCountries.length > 0 && !selectedCountries.includes(t.country)) {
        return false;
      }
      
      // Discipline filter
      if (selectedDisciplines.length > 0 && !selectedDisciplines.includes(t.discipline)) {
        return false;
      }
      
      // Level filter
      if (selectedLevels.length > 0 && t.level) {
        const levelMatch = selectedLevels.some(l => 
          l.toLowerCase().replace(' ', '-') === t.level
        );
        if (!levelMatch) return false;
      }
      
      // Format filter
      if (selectedFormats.length > 0) {
        const formatMatch = selectedFormats.some(f => 
          f.toLowerCase() === t.format
        );
        if (!formatMatch) return false;
      }
      
      // Status filter
      if (selectedStatuses.length > 0) {
        const statusMap: Record<string, string> = {
          'Registration Open': 'registration',
          'Upcoming': 'upcoming',
          'Closed': 'closed'
        };
        const statusMatch = selectedStatuses.some(s => 
          statusMap[s] === t.status
        );
        if (!statusMatch) return false;
      }
      
      // Prize filter
      const prizeValue = parseInt(t.prize.replace(/[€,]/g, ''));
      if (prizeValue < prizeMin || prizeValue > prizeMax) {
        return false;
      }
      
      return true;
    }).length;
  }, [tournaments, selectedCountries, selectedDisciplines, selectedLevels, selectedFormats, selectedStatuses, prizeMin, prizeMax]);

  const handleReset = () => {
    setSelectedCountries([]);
    setSelectedDisciplines([]);
    setSelectedLevels([]);
    setSelectedFormats([]);
    setSelectedStatuses([]);
    setPrizeMin(0);
    setPrizeMax(50000);
    setDatePreset('all');
  };

  const handleApply = () => {
    const filters: TournamentFilters = {
      countries: selectedCountries,
      disciplines: selectedDisciplines,
      levels: selectedLevels,
      formats: selectedFormats,
      prizeRange: { min: prizeMin, max: prizeMax },
      dateRange: { start: null, end: null },
      statuses: selectedStatuses
    };
    onApply(filters);
  };

  const toggleItem = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
              Filters
            </h1>
          </div>
          <button 
            onClick={handleReset}
            className="font-['Inter',sans-serif] text-sm font-semibold hover:underline"
          >
            Reset All
          </button>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90 ml-9">
          Refine tournament search
        </p>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+100px)]">
        {/* Date Range */}
        <div className="mb-8">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
            Date Range
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['All Time', 'This Month', 'Next 3 Months', 'This Season'].map(preset => (
              <button
                key={preset}
                onClick={() => setDatePreset(preset.toLowerCase().replace(' ', '-'))}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  datePreset === preset.toLowerCase().replace(' ', '-')
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament Level */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Tournament Level
            </h3>
            {selectedLevels.length > 0 && (
              <button 
                onClick={() => setSelectedLevels([])}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => toggleItem(level, selectedLevels, setSelectedLevels)}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  selectedLevels.includes(level)
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Discipline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Discipline
            </h3>
            {selectedDisciplines.length > 0 && (
              <button 
                onClick={() => setSelectedDisciplines([])}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          {userProfile && (
            <button
              onClick={() => {
                if (selectedDisciplines.includes(userProfile.primaryDiscipline)) {
                  setSelectedDisciplines(selectedDisciplines.filter(d => d !== userProfile.primaryDiscipline));
                } else {
                  setSelectedDisciplines([userProfile.primaryDiscipline]);
                }
              }}
              className={`w-full p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold mb-2 transition-colors ${
                selectedDisciplines.includes(userProfile.primaryDiscipline)
                  ? 'bg-[#F0A720] text-white'
                  : 'bg-[#F0A720]/10 text-[#F0A720] border border-[#F0A720]/30'
              }`}
            >
              ⭐ My Primary: {userProfile.primaryDiscipline}
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            {disciplines.map(disc => (
              <button
                key={disc}
                onClick={() => toggleItem(disc, selectedDisciplines, setSelectedDisciplines)}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  selectedDisciplines.includes(disc)
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Format
            </h3>
            {selectedFormats.length > 0 && (
              <button 
                onClick={() => setSelectedFormats([])}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {formats.map(format => (
              <button
                key={format}
                onClick={() => toggleItem(format, selectedFormats, setSelectedFormats)}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  selectedFormats.includes(format)
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Prize Pool Range */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Prize Pool
            </h3>
            <span className="font-['Inter',sans-serif] text-sm text-gray-600">
              €{prizeMin.toLocaleString()} - €{prizeMax.toLocaleString()}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="mb-4">
              <label className="block font-['Inter',sans-serif] text-sm text-gray-600 mb-2">
                Minimum (€)
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={prizeMin}
                onChange={(e) => setPrizeMin(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#207DF0]"
              />
            </div>
            <div>
              <label className="block font-['Inter',sans-serif] text-sm text-gray-600 mb-2">
                Maximum (€)
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={prizeMax}
                onChange={(e) => setPrizeMax(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#207DF0]"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Location
            </h3>
            {selectedCountries.length > 0 && (
              <button 
                onClick={() => setSelectedCountries([])}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          {selectedCountries.length === 0 && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-['Inter',sans-serif] text-sm text-blue-700">
                🌍 All Europe (no filter)
              </p>
            </div>
          )}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {filteredCountries.map(country => (
              <button
                key={country}
                onClick={() => toggleItem(country, selectedCountries, setSelectedCountries)}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  selectedCountries.includes(country)
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900">
              Status
            </h3>
            {selectedStatuses.length > 0 && (
              <button 
                onClick={() => setSelectedStatuses([])}
                className="font-['Inter',sans-serif] text-sm text-[#207DF0] font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => toggleItem(status, selectedStatuses, setSelectedStatuses)}
                className={`p-3 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-colors ${
                  selectedStatuses.includes(status)
                    ? 'bg-[#207DF0] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-[30px] bg-white border-t border-gray-200">
        <Button variant="accent1" fullWidth onClick={handleApply}>
          Apply Filters ({filteredCount} Results)
        </Button>
      </div>
    </div>
  );
}