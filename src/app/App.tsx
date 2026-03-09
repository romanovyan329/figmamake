import { useState, useEffect, useRef } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { StatsScreen } from './screens/StatsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TournamentDetailsScreen } from './screens/TournamentDetailsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { FilterScreen } from './screens/FilterScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { WaterBodyScreen } from './screens/WaterBodyScreen';
import { Onboarding1, Onboarding2, Onboarding3 } from './screens/OnboardingScreens';
import { CreateProfileScreen } from './screens/CreateProfileScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { MyTeamsScreen } from './screens/MyTeamsScreen';
import { TournamentResultDetailScreen } from './screens/TournamentResultDetailScreen';
import { CreateTeamScreen } from './screens/CreateTeamScreen';
import { TeamDetailsScreen } from './screens/TeamDetailsScreen';
import { AddMemberScreen } from './screens/AddMemberScreen';
import { EditMemberScreen } from './screens/EditMemberScreen';
import { EditTeamScreen } from './screens/EditTeamScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { FederationLicenseScreen } from './screens/FederationLicenseScreen';
import { AppProvider, useApp } from './context/AppContext';
import { TournamentFilters } from './types/tournament';
import { ErrorBoundary } from './components/ErrorBoundary';

type Screen = 
  | 'splash' 
  | 'onboarding-1' 
  | 'onboarding-2' 
  | 'onboarding-3' 
  | 'create-profile'
  | 'home' 
  | 'calendar' 
  | 'stats' 
  | 'profile' 
  | 'tournament-details' 
  | 'search' 
  | 'filter' 
  | 'register' 
  | 'water-body' 
  | 'history'
  | 'edit-profile'
  | 'my-teams'
  | 'tournament-result-detail'
  | 'create-team'
  | 'team-details'
  | 'add-member'
  | 'leaderboard'
  | 'federation-license';

function AppContent() {
  const { userProfile } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const homeScreenRef = useRef<{ applyFilters: (filters: TournamentFilters) => void } | null>(null);

  useEffect(() => {
    // Auto-transition from splash to onboarding after 2 seconds
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        // Check if user has profile, if yes go to home, otherwise onboarding
        setCurrentScreen(userProfile ? 'home' : 'onboarding-1');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, userProfile]);

  const handleNavigate = (screen: string) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleApplyFilters = (filters: TournamentFilters) => {
    homeScreenRef.current?.applyFilters(filters);
    handleBack();
  };

  return (
    <div className="size-full">
      {currentScreen === 'splash' && <SplashScreen />}
      
      {currentScreen === 'onboarding-1' && <Onboarding1 onNavigate={handleNavigate} />}
      {currentScreen === 'onboarding-2' && <Onboarding2 onNavigate={handleNavigate} />}
      {currentScreen === 'onboarding-3' && <Onboarding3 onNavigate={handleNavigate} />}
      
      {currentScreen === 'create-profile' && <CreateProfileScreen onNavigate={handleNavigate} allowSkip />}
      
      {currentScreen === 'home' && <HomeScreen ref={homeScreenRef} onNavigate={handleNavigate} />}
      {currentScreen === 'calendar' && <CalendarScreen onNavigate={handleNavigate} />}
      {currentScreen === 'stats' && <StatsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
      {currentScreen === 'tournament-details' && <TournamentDetailsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'search' && <SearchScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'filter' && <FilterScreen onBack={handleBack} onApply={handleApplyFilters} />}
      {currentScreen === 'register' && <RegisterScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'water-body' && <WaterBodyScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'history' && <HistoryScreen onNavigate={handleNavigate} />}
      {currentScreen === 'edit-profile' && <EditProfileScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'my-teams' && <MyTeamsScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'tournament-result-detail' && <TournamentResultDetailScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'create-team' && <CreateTeamScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'team-details' && <TeamDetailsScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'add-member' && <AddMemberScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'edit-member' && <EditMemberScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'edit-team' && <EditTeamScreen onBack={handleBack} />}
      {currentScreen === 'leaderboard' && <LeaderboardScreen onNavigate={handleNavigate} onBack={handleBack} />}
      {currentScreen === 'federation-license' && <FederationLicenseScreen onNavigate={handleNavigate} onBack={handleBack} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

// Ensure hot module replacement preserves the provider
if (import.meta.hot) {
  import.meta.hot.accept();
}