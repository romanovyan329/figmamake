import { TopNav } from '../components/TopNav';
import { BottomNav } from '../components/BottomNav';
import { useState } from 'react';
import imgLogo from "../assets/logo.svg";
import { useApp } from '../context/AppContext';
import { User, Settings, History, Users, Info, Shield, X, Check, Clock, AlertCircle, Edit, UserPlus } from 'lucide-react';
import { Button } from '../components/Button';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { userProfile, myEntries, teams } = useApp();
  const [showAboutApp, setShowAboutApp] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
        <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-6 rounded-b-3xl">
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Profile
          </h1>
        </div>
        
        <div className="px-4 mt-12 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#F0A720]/10 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-12 h-12 text-[#F0A720]" />
          </div>
          
          <h2 className="font-['Figtree',sans-serif] font-black text-2xl text-gray-900 mb-3 text-center">
            Create Your Profile
          </h2>
          
          <p className="font-['Inter',sans-serif] text-center text-gray-600 mb-8 max-w-sm">
            Set up your athlete profile to unlock full functionality: register for tournaments, track results, and analyze your career progress.
          </p>

          <div className="w-full max-w-sm">
            <Button variant="accent1" fullWidth onClick={() => onNavigate('create-profile')}>
              Create Profile
            </Button>
          </div>

          <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-sm">
            <h3 className="font-['Figtree',sans-serif] font-bold text-gray-900 mb-2">
              📌 What you can do with a profile:
            </h3>
            <ul className="font-['Inter',sans-serif] text-sm text-gray-700 space-y-1">
              <li>• Register for tournaments</li>
              <li>• Track results and statistics</li>
              <li>• Build your career history</li>
              <li>• Analyze performance by discipline</li>
              <li>• Manage team participation</li>
            </ul>
          </div>
        </div>

        <BottomNav active="profile" onNavigate={onNavigate} />
      </div>
    );
  }

  const completedTournaments = myEntries.filter(e => e.results?.finalPosition).length;
  const bestPosition = completedTournaments > 0 
    ? Math.min(...myEntries.filter(e => e.results?.finalPosition).map(e => e.results!.finalPosition!))
    : null;
  const biggestCatch = completedTournaments > 0
    ? Math.max(...myEntries.filter(e => e.results?.bigFish).map(e => e.results!.bigFish!)) / 1000
    : null;
  const podiums = myEntries.filter(e => e.results?.finalPosition && e.results.finalPosition <= 3).length;

  // Calculate seasons - for now just 2026
  const seasons = 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white">
      {/* Header */}
      <div className="bg-[#207DF0] text-white px-4 pt-[calc(60px+24px)] pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-['Figtree',sans-serif] font-black text-2xl">
            Profile
          </h1>
          <button 
            onClick={() => onNavigate('edit-profile')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            {userProfile.photo ? (
              <img src={userProfile.photo} alt={userProfile.fullName || `${userProfile.firstName} ${userProfile.lastName}`} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-['Figtree',sans-serif] font-black text-2xl mb-1">
              {userProfile.fullName || `${userProfile.firstName} ${userProfile.lastName}`}
            </h2>
            <p className="font-['Inter',sans-serif] text-sm opacity-90 mb-1">
              {userProfile.country}
            </p>
            
            {/* Federation License Status Badge */}
            {userProfile.federationLicenseStatus === 'verified' && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                  <Check className="w-3 h-3 text-green-300" />
                  <span className="font-['Inter',sans-serif] text-xs font-semibold text-green-100">
                    Verified Athlete
                  </span>
                </div>
              </div>
            )}
            
            {userProfile.federationLicenseStatus === 'pending' && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                  <Clock className="w-3 h-3 text-yellow-300" />
                  <span className="font-['Inter',sans-serif] text-xs font-semibold text-yellow-100">
                    Verification Pending
                  </span>
                </div>
              </div>
            )}
            
            {(!userProfile.federationLicenseStatus || userProfile.federationLicenseStatus === 'not-linked') && (
              <button 
                onClick={() => onNavigate('federation-license')}
                className="flex items-center gap-1.5 mb-2 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                  <AlertCircle className="w-3 h-3 text-white/80" />
                  <span className="font-['Inter',sans-serif] text-xs font-semibold text-white/80">
                    Link Federation ID
                  </span>
                </div>
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full font-['Inter',sans-serif] text-xs font-semibold">
                {userProfile.primaryDiscipline || userProfile.disciplines?.[0] || 'Angler'}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full font-['Inter',sans-serif] text-xs font-semibold">
                {userProfile.competitionType === 'individual' ? 'Individual' : 'Team'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 pb-[calc(30px+80px)]">
        {/* Career Statistics */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
            Career Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#207DF0] mb-1">
                {seasons}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                Seasons
              </div>
            </div>
            <div className="text-center">
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#207DF0] mb-1">
                {myEntries.length}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                Tournaments
              </div>
            </div>
            <div className="text-center">
              <div className="font-['Figtree',sans-serif] font-black text-2xl text-[#F0A720] mb-1">
                {podiums}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                Podiums
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="font-['Figtree',sans-serif] font-black text-xl text-[#3F6692] mb-1">
                {bestPosition ? `#${bestPosition}` : '-'}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                Best Result
              </div>
            </div>
            <div className="text-center">
              <div className="font-['Figtree',sans-serif] font-black text-xl text-[#3F6692] mb-1">
                {biggestCatch ? `${biggestCatch}kg` : '-'}
              </div>
              <div className="font-['Inter',sans-serif] text-xs text-gray-600">
                Biggest Catch
              </div>
            </div>
          </div>
        </div>

        {/* Tournament History */}
        {completedTournaments > 0 && (
          <button
            onClick={() => onNavigate('history')}
            className="bg-white rounded-xl shadow-md p-4 mb-4 w-full text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <History className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                    Tournament History
                  </h4>
                  <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                    {completedTournaments} completed event{completedTournaments !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Edit className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        )}

        {/* My Teams */}
        <button
          onClick={() => onNavigate('my-teams')}
          className="bg-white rounded-xl shadow-md p-4 mb-4 w-full text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  My Teams
                </h4>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                  {teams.length > 0 ? `${teams.length} team${teams.length !== 1 ? 's' : ''}` : 'Create your first team'}
                </p>
              </div>
            </div>
            <Edit className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Settings & Information */}
        <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Settings & Information
        </h3>

        {/* About App Button */}
        <button
          onClick={() => setShowAboutApp(true)}
          className="bg-white rounded-xl shadow-md p-4 mb-3 w-full text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#207DF0]/10 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-[#207DF0]" />
              </div>
              <div>
                <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  About Fishing Champions
                </h4>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                  Learn more about the app
                </p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>

        {/* Privacy Policy Button */}
        <button
          onClick={() => setShowPrivacyPolicy(true)}
          className="bg-white rounded-xl shadow-md p-4 mb-3 w-full text-left hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-['Figtree',sans-serif] font-bold text-gray-900">
                  Privacy Policy
                </h4>
                <p className="font-['Inter',sans-serif] text-sm text-gray-600">
                  Data & privacy information
                </p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>
      </div>

      <BottomNav active="profile" onNavigate={onNavigate} />

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
                  <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src={imgLogo} 
                      alt="Fishing Champions Logo" 
                      className="w-full h-full object-contain"
                    />
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
    </div>
  );
}