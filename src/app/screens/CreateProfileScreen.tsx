import { Camera, Image, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

interface CreateProfileScreenProps {
  onNavigate: (screen: string) => void;
  allowSkip?: boolean;
}

const countries = [
  'Poland', 'Italy', 'Germany', 'Czech Republic', 'France', 
  'Spain', 'Netherlands', 'Belgium', 'Austria', 'Latvia',
  'Lithuania', 'Estonia', 'Hungary', 'Romania', 'Bulgaria'
];

const disciplines = [
  'Feeder', 'Match Fishing', 'Float', 'Carp', 
  'Spinning', 'Fly Fishing', 'Ice Fishing'
];

export function CreateProfileScreen({ onNavigate, allowSkip = false }: CreateProfileScreenProps) {
  const { createProfile } = useApp();
  
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [primaryDiscipline, setPrimaryDiscipline] = useState('');
  const [competitionType, setCompetitionType] = useState<'individual' | 'team'>('individual');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!country) newErrors.country = 'Country is required';
    if (!primaryDiscipline) newErrors.primaryDiscipline = 'Primary discipline is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProfile = () => {
    if (!validate()) return;

    createProfile({
      fullName: fullName.trim(),
      country,
      primaryDiscipline,
      competitionType,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      photo: photoUrl || undefined,
      createdAt: new Date().toISOString()
    });

    onNavigate('home');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoMenu(false);
  };

  const handlePhotoFromGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6">
        <h1 className="font-['Figtree',sans-serif] font-black text-2xl mb-2">
          Create Your Profile
        </h1>
        <p className="font-['Inter',sans-serif] text-sm opacity-90">
          Set up your athlete profile to start tracking
        </p>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+160px)]">
        {/* Photo Upload */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowPhotoMenu(true)}
            className="relative w-32 h-32 bg-gradient-to-br from-[#207DF0]/20 to-[#B0CBFF]/30 rounded-full flex items-center justify-center group hover:from-[#207DF0]/30 hover:to-[#B0CBFF]/40 transition-colors"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Camera className="w-12 h-12 text-[#207DF0]" />
            )}
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#F0A720] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
          </button>
        </div>
        <p className="text-center font-['Inter',sans-serif] text-sm text-gray-600 mb-8">
          Add profile photo (optional)
        </p>

        {/* Full Name */}
        <div className="mb-6">
          <label className="block font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={`w-full p-4 rounded-xl border font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] ${
              errors.fullName ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1 font-['Inter',sans-serif]">{errors.fullName}</p>
          )}
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`w-full p-4 rounded-xl border font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] ${
              errors.country ? 'border-red-500' : 'border-gray-200'
            } ${!country ? 'text-gray-400' : 'text-gray-900'}`}
          >
            <option value="">Select your country</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1 font-['Inter',sans-serif]">{errors.country}</p>
          )}
        </div>

        {/* Primary Discipline */}
        <div className="mb-6">
          <label className="block font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
            Primary Discipline <span className="text-red-500">*</span>
          </label>
          <select
            value={primaryDiscipline}
            onChange={(e) => setPrimaryDiscipline(e.target.value)}
            className={`w-full p-4 rounded-xl border font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0] ${
              errors.primaryDiscipline ? 'border-red-500' : 'border-gray-200'
            } ${!primaryDiscipline ? 'text-gray-400' : 'text-gray-900'}`}
          >
            <option value="">Select your discipline</option>
            {disciplines.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.primaryDiscipline && (
            <p className="text-red-500 text-sm mt-1 font-['Inter',sans-serif]">{errors.primaryDiscipline}</p>
          )}
        </div>

        {/* Competition Type */}
        <div className="mb-6">
          <label className="block font-['Figtree',sans-serif] font-bold text-gray-900 mb-3">
            Competition Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCompetitionType('individual')}
              className={`p-4 rounded-xl font-['Figtree',sans-serif] font-bold transition-colors ${
                competitionType === 'individual'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setCompetitionType('team')}
              className={`p-4 rounded-xl font-['Figtree',sans-serif] font-bold transition-colors ${
                competitionType === 'team'
                  ? 'bg-[#207DF0] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Team
            </button>
          </div>
        </div>

        {/* Years of Experience */}
        <div className="mb-6">
          <label className="block font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
            Years of Experience <span className="text-gray-400 font-normal text-sm">(Optional)</span>
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder="Enter years of experience"
            className="w-full p-4 rounded-xl border border-gray-200 font-['Inter',sans-serif] text-sm outline-none focus:border-[#207DF0]"
          />
        </div>
      </div>

      {/* Fixed Bottom Button - extended background */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-[30px] bg-white border-t border-gray-200">
        <Button variant="accent1" fullWidth onClick={handleCreateProfile}>
          Create Profile
        </Button>
        {allowSkip && (
          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-3 py-3 font-['Figtree',sans-serif] font-bold text-[#207DF0] text-sm"
          >
            Skip for Now
          </button>
        )}
      </div>

      {/* Photo Source Menu (Bottom Sheet) */}
      {showPhotoMenu && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPhotoMenu(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up pb-[30px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Figtree',sans-serif] font-bold text-xl text-gray-900">
                  Add Photo
                </h3>
                <button 
                  onClick={() => setShowPhotoMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleTakePhoto}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#207DF0]/10 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#207DF0]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                      Take Photo
                    </h4>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                      Use camera to take a new photo
                    </p>
                  </div>
                </button>

                <button
                  onClick={handlePhotoFromGallery}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#F0A720]/10 rounded-full flex items-center justify-center">
                    <Image className="w-6 h-6 text-[#F0A720]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                      Choose from Gallery
                    </h4>
                    <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                      Select from your photos
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}