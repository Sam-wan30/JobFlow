import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import QuickAddButton from './QuickAddButton';
import {
  LayoutDashboard,
  Kanban,
  Briefcase,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import logo from '../assets/jobflow-logo.png';
import ThemeToggle from './ThemeToggle';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Board', path: '/kanban', icon: Kanban },
    { name: 'Job Applications', path: '/jobs', icon: Briefcase },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 transition-colors dark:bg-slate-950">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 px-2 pb-8 cursor-pointer hover:opacity-80 transition-opacity">
          <img src={logo} alt="JobFlow logo" className="h-9 w-9 rounded-lg object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-800" />
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight font-sans tracking-tight dark:text-white">JobFlow</h1>
            <p className="text-xs text-slate-400">Track & Flow</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-slate-200 pt-4 mt-auto dark:border-slate-800">
          <div className="flex items-center gap-3 px-2 py-1 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold uppercase dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.[0] || user?.email?.[0] || 'U'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 transition-colors dark:border-slate-800 dark:bg-slate-950 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Job Details'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 dark:text-slate-400">v1.0.0</span>
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8 transition-colors dark:bg-slate-950 lg:px-8">
          <Outlet />
        </main>
        <QuickAddButton />
      </div>
    </div>
  );
};

export default DashboardLayout;
