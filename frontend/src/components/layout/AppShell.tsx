import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavbar } from './MobileNavbar';
import { GlobalCreateButton } from './GlobalCreateButton';
import { GlobalCreateMenu } from './GlobalCreateMenu';
import { useUIStore } from '../../stores/uiStore';

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'md:ml-60' : 'md:ml-16'
        }`}
      >
        <Topbar />
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNavbar />

      {/* FAB for mobile */}
      <GlobalCreateButton />

      {/* Create menu */}
      <GlobalCreateMenu />
    </div>
  );
}
