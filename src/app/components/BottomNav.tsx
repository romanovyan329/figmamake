import { Home, Calendar, TrendingUp, User } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'calendar' | 'stats' | 'profile';
  onNavigate: (screen: 'home' | 'calendar' | 'stats' | 'profile') => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'calendar' as const, icon: Calendar, label: 'Calendar' },
    { id: 'stats' as const, icon: TrendingUp, label: 'Stats' },
    { id: 'profile' as const, icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 pb-[30px]">
      <div className="flex justify-around items-center max-w-md mx-auto px-2 py-3">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 transition-colors"
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? 'text-[#207DF0]' : 'text-gray-500'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs font-['Inter',sans-serif] ${isActive ? 'text-[#207DF0] font-semibold' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}