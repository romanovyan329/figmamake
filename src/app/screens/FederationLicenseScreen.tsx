import { ArrowLeft, Check, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';

interface FederationLicenseScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export function FederationLicenseScreen({ onNavigate, onBack }: FederationLicenseScreenProps) {
  const { userProfile, updateProfile } = useApp();
  const [licenseId, setLicenseId] = useState(userProfile?.federationLicenseId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = userProfile?.federationLicenseStatus || 'not-linked';

  const handleSubmit = () => {
    if (!licenseId.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        federationLicenseId: licenseId,
        federationLicenseStatus: 'pending'
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const renderStatusSection = () => {
    switch (status) {
      case 'verified':
        return (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-green-900">
                  Verified Athlete
                </h3>
                <p className="font-['Inter',sans-serif] text-sm text-green-700">
                  Official results linked
                </p>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 mt-4">
              <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                License ID
              </p>
              <p className="font-['Figtree',sans-serif] font-bold text-gray-900">
                {userProfile?.federationLicenseId}
              </p>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-yellow-900">
                  Verification Pending
                </h3>
                <p className="font-['Inter',sans-serif] text-sm text-yellow-700">
                  Your license is being verified
                </p>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 mt-4">
              <p className="font-['Inter',sans-serif] text-xs text-gray-600 mb-1">
                Submitted License ID
              </p>
              <p className="font-['Figtree',sans-serif] font-bold text-gray-900">
                {userProfile?.federationLicenseId}
              </p>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="font-['Inter',sans-serif] text-xs text-yellow-800">
                <strong>Note:</strong> Verification typically takes 1-3 business days. You will be notified once your license is verified.
              </p>
            </div>
          </div>
        );

      case 'not-linked':
      default:
        return (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-blue-900">
                  No Federation ID Linked
                </h3>
                <p className="font-['Inter',sans-serif] text-sm text-blue-700">
                  Link your license to access official results
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-[#207DF0] via-[#4A93F3] to-[#B0CBFF] pb-[calc(env(safe-area-inset-bottom)+30px)]">
      {/* Fixed Header with Back Button */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#207DF0] to-[#207DF0]/95 backdrop-blur-sm">
        <div className="px-4 pt-[calc(env(safe-area-inset-top)+40px)] pb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 -ml-2 text-white hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-['Figtree',sans-serif] font-black text-2xl text-white">
                Federation License
              </h1>
              <p className="font-['Inter',sans-serif] text-sm text-white/80 mt-0.5">
                Link your official federation license ID
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {renderStatusSection()}

        {/* Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-3">
            Why Link Your License?
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#207DF0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="font-['Inter',sans-serif] text-sm text-gray-700">
                Access your official tournament results and rankings
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#207DF0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="font-['Inter',sans-serif] text-sm text-gray-700">
                View accurate career statistics based on federation data
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#207DF0] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="font-['Inter',sans-serif] text-sm text-gray-700">
                Get verified athlete badge on your profile
              </p>
            </div>
          </div>
        </div>

        {/* License Input (only shown if not verified) */}
        {status !== 'verified' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-['Figtree',sans-serif] font-bold text-lg text-gray-900 mb-4">
              {status === 'pending' ? 'Update License ID' : 'Enter License ID'}
            </h3>
            
            <div className="mb-4">
              <label className="font-['Inter',sans-serif] text-sm text-gray-700 mb-2 block">
                Federation License ID
              </label>
              <input
                type="text"
                value={licenseId}
                onChange={(e) => setLicenseId(e.target.value)}
                placeholder="e.g., POL-FED-2015-A042"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-['Inter',sans-serif] text-gray-900 focus:outline-none focus:border-[#207DF0] transition-colors"
              />
              <p className="font-['Inter',sans-serif] text-xs text-gray-500 mt-2">
                Enter your official federation license ID exactly as it appears on your license card.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!licenseId.trim() || isSubmitting}
              className="w-full"
              style={{
                background: 'linear-gradient(135deg, #F0A720 0%, #D89510 100%)',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)',
                opacity: (!licenseId.trim() || isSubmitting) ? 0.5 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : status === 'pending' ? 'Update License ID' : 'Submit for Verification'}
            </Button>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mt-6">
          <h4 className="font-['Figtree',sans-serif] font-bold text-sm text-gray-900 mb-2">
            Need Help?
          </h4>
          <p className="font-['Inter',sans-serif] text-xs text-gray-600">
            If you don't know your federation license ID, please contact your national fishing federation or check your official license documentation.
          </p>
        </div>
      </div>
    </div>
  );
}