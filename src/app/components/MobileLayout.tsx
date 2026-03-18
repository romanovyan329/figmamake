import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export function MobileLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}