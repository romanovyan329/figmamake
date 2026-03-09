import { ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

interface OnboardingScreenProps {
  onNavigate: (screen: string) => void;
}

export function Onboarding1({ onNavigate }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#207DF0] to-[#B0CBFF] flex flex-col items-center justify-center px-6 pt-[60px] pb-[30px]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Illustration placeholder */}
        <div className="w-64 h-64 mb-12 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-8xl">🎣</span>
        </div>

        <h1 className="font-['Inter',sans-serif] font-black text-4xl text-white text-center mb-4">
          Track European Fishing Tournaments
        </h1>

        <p className="font-['Inter',sans-serif] text-lg text-white/90 text-center mb-12">
          Discover competitions and plan your season
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button 
          variant="accent1" 
          fullWidth 
          onClick={() => onNavigate('onboarding-2')}
        >
          Continue
        </Button>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

export function Onboarding2({ onNavigate }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#207DF0] to-[#B0CBFF] flex flex-col items-center justify-center px-6 pt-[60px] pb-[30px]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Illustration placeholder */}
        <div className="w-64 h-64 mb-12 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-8xl">📅</span>
        </div>

        <h1 className="font-['Inter',sans-serif] font-black text-4xl text-white text-center mb-4">
          Build Your Season
        </h1>

        <p className="font-['Inter',sans-serif] text-lg text-white/90 text-center mb-12">
          Add tournaments and track your results
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button 
          variant="accent1" 
          fullWidth 
          onClick={() => onNavigate('onboarding-3')}
        >
          Continue
        </Button>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

export function Onboarding3({ onNavigate }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#207DF0] to-[#B0CBFF] flex flex-col items-center justify-center px-6 pt-[60px] pb-[30px]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Illustration placeholder */}
        <div className="w-64 h-64 mb-12 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-8xl">📊</span>
        </div>

        <h1 className="font-['Inter',sans-serif] font-black text-4xl text-white text-center mb-4">
          Analyze Your Performance
        </h1>

        <p className="font-['Inter',sans-serif] text-lg text-white/90 text-center mb-12">
          Monitor progress, rankings and statistics
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button 
          variant="accent1" 
          fullWidth 
          onClick={() => onNavigate('create-profile')}
        >
          Get Started
        </Button>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
