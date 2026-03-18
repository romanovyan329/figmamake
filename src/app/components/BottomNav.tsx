import { Link, useLocation } from 'react-router';
import { Home, Trophy, Map, Award, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tournaments', icon: Trophy, label: 'Tournaments' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/season', icon: Award, label: 'Season' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800" style={{ paddingBottom: '30px' }}>
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-slate-400'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}