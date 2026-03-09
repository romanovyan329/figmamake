import { ArrowLeft, Camera, Image, X, Info, Shield, Trash2, AlertTriangle, Award } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

interface EditProfileScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
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

export function EditProfileScreen({ onNavigate, onBack }: EditProfileScreenProps) {
  const { userProfile, updateProfile } = useApp();
  
  // Construct fullName from available fields
  const initialFullName = userProfile?.fullName || 
    (userProfile?.firstName && userProfile?.lastName 
      ? `${userProfile.firstName} ${userProfile.lastName}` 
      : '');
  
  const [fullName, setFullName] = useState(initialFullName);
  const [country, setCountry] = useState(userProfile?.country || '');
  const [primaryDiscipline, setPrimaryDiscipline] = useState(
    userProfile?.primaryDiscipline || 
    (userProfile?.disciplines && userProfile.disciplines.length > 0 ? userProfile.disciplines[0] : '')
  );
  const [competitionType, setCompetitionType] = useState<'individual' | 'team'>(
    userProfile?.competitionType || 'individual'
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    userProfile?.yearsOfExperience?.toString() || ''
  );
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(userProfile?.photo || null);
  const [showAboutApp, setShowAboutApp] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  const handleUpdateProfile = () => {
    if (!validate()) return;

    updateProfile({
      fullName: fullName.trim(),
      country,
      primaryDiscipline,
      competitionType,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      photo: photoUrl || undefined,
    });

    onBack();
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
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Edit Profile
          </h1>
        </div>
        <p className="font-['Inter',sans-serif] text-sm opacity-90 pl-10">
          Update your athlete profile information
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
              <span className="text-white text-xl font-bold">✏</span>
            </div>
          </button>
        </div>
        <p className="text-center font-['Inter',sans-serif] text-sm text-gray-600 mb-8">
          Update profile photo
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

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Settings & Information */}
        <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">Settings & Information</h3>

        {/* About App Button */}
        <button
          onClick={() => setShowAboutApp(true)}
          className="w-full bg-white rounded-xl p-4 shadow-md mb-3 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#207DF0]/10 rounded-full flex items-center justify-center">
              <Info className="w-6 h-6 text-[#207DF0]" />
            </div>
            <div className="text-left">
              <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                About Fishing Champions
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                Learn more about the app
              </p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* Privacy Policy Button */}
        <button
          onClick={() => setShowPrivacyPolicy(true)}
          className="w-full bg-white rounded-xl p-4 shadow-md mb-3 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                Privacy Policy
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                Data & privacy information
              </p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* Federation License Button */}
        <button
          onClick={() => onNavigate('federation-license')}
          className="w-full bg-white rounded-xl p-4 shadow-md mb-3 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F0A720]/10 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-[#F0A720]" />
            </div>
            <div className="text-left">
              <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                Federation License
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                Link your official license ID
              </p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        {/* Delete Profile Button */}
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="w-full bg-red-50 rounded-xl p-4 border border-red-200 mb-3 flex items-center justify-between hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-left">
              <h4 className="font-['Figtree',sans-serif] font-bold text-red-600">
                Delete Profile
              </h4>
              <p className="font-['Inter',sans-serif] text-sm text-red-500">
                Permanently remove your data
              </p>
            </div>
          </div>
          <span className="text-red-400">→</span>
        </button>
      </div>

      {/* Fixed Bottom Button - extended background */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-[30px] bg-white border-t border-gray-200">
        <Button variant="accent1" fullWidth onClick={handleUpdateProfile}>
          Save Changes
        </Button>
        <button
          onClick={onBack}
          className="w-full mt-3 py-3 font-['Figtree',sans-serif] font-bold text-gray-600 text-sm"
        >
          Cancel
        </button>
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
                  Update Photo
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

      {/* About App Modal */}
      {showAboutApp && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowAboutApp(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto pb-[30px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Figtree',sans-serif] font-bold text-2xl text-gray-900">
                  About Fishing Champions
                </h3>
                <button 
                  onClick={() => setShowAboutApp(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#207DF0] to-[#3F6692] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-5xl">🎣</span>
                  </div>
                  <h4 className="font-['Figtree',sans-serif] font-black text-xl text-gray-900 mb-1">
                    Fishing Champions
                  </h4>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                    Version 1.0.0 • 2026
                  </p>
                </div>

                <div className="bg-[#207DF0]/5 rounded-xl p-4">
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    Professional Career Tracker
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    Fishing Champions is a professional tool for competitive sport fishing athletes. Navigate European tournaments, track your performance, and analyze your career progress across all disciplines.
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                    Key Features:
                  </h5>
                  <div className="space-y-2">
                    {[
                      '🏆 European Tournament Navigator',
                      '📊 Advanced Career Analytics',
                      '📅 Season Planning & Management',
                      '🎯 Personal Performance Tracking',
                      '💾 Complete Data Ownership',
                      '👥 Team Management System'
                    ].map((feature, idx) => (
                      <p key={idx} className="font-['Inter',sans-serif] text-sm text-gray-700">
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700">
                    <span className="font-bold">Important:</span> This is a personal career management tool, not a social network. All data is created and managed by you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPrivacyPolicy(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto pb-[30px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Figtree',sans-serif] font-bold text-2xl text-gray-900">
                  Privacy Policy
                </h3>
                <button 
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h5 className="font-['Figtree',sans-serif] font-bold text-green-900">
                      Your Privacy is Our Priority
                    </h5>
                  </div>
                  <p className="font-['Inter',sans-serif] text-sm text-green-800">
                    Fishing Champions respects your privacy and is committed to protecting your personal information.
                  </p>
                </div>

                <div>
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    Data Collection
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    We <span className="font-bold">do not collect, store, or transmit</span> your personal data to any external servers. All information you enter remains stored locally on your device.
                  </p>
                </div>

                <div>
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    Local Storage Only
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    Your profile, tournament entries, results, and statistics are saved exclusively in your browser's local storage. This data never leaves your device.
                  </p>
                </div>

                <div>
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    No Third-Party Sharing
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    We do not share, sell, or distribute your information to any third parties. Your data belongs solely to you.
                  </p>
                </div>

                <div>
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    No Analytics or Tracking
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    We do not use cookies, analytics tools, or tracking pixels. Your activity within the app is completely private.
                  </p>
                </div>

                <div>
                  <h5 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
                    Data Control
                  </h5>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                    You have complete control over your data. You can delete your profile and all associated information at any time from the settings.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-['Inter',sans-serif] text-xs text-gray-600 leading-relaxed">
                    <span className="font-bold">Note:</span> Images from tournament water bodies are fetched from Unsplash API for illustrative purposes only and are not stored locally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDeleteConfirmation(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up pb-[30px]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-['Figtree',sans-serif] font-bold text-xl text-gray-900">
                    Delete Profile?
                  </h3>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="font-['Inter',sans-serif] text-sm text-gray-700 leading-relaxed">
                  This action will permanently delete your profile and all associated data, including:
                </p>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <ul className="font-['Inter',sans-serif] text-sm text-red-800 space-y-2">
                    <li>• Your athlete profile and photo</li>
                    <li>• All tournament entries and registrations</li>
                    <li>• Competition results and statistics</li>
                    <li>• Team memberships and data</li>
                    <li>• Career history and analytics</li>
                  </ul>
                </div>

                <p className="font-['Inter',sans-serif] text-sm font-bold text-red-600">
                  ⚠️ This action cannot be undone. All your data will be permanently erased from local storage.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Clear all data from localStorage
                    localStorage.clear();
                    // Navigate to onboarding
                    setShowDeleteConfirmation(false);
                    onNavigate('onboarding-1');
                  }}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-['Figtree',sans-serif] font-bold hover:bg-red-700 transition-colors"
                >
                  Yes, Delete My Profile
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-['Figtree',sans-serif] font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}