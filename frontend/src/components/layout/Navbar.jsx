import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, BarChart3, Settings, Activity, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/limits', icon: Settings, label: 'Limits' },
    { path: '/activity', icon: Activity, label: 'Activity' },
    { path: '/notifications', icon: Bell, label: 'Notifications' }
  ];

  const mobileNavItems = [
    ...navItems,
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Social Tracker
              </Link>
            </div>
            
            {user && (
              <div className="flex items-center space-x-6">
                {navItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`text-sm font-medium transition-colors ${
                      isActive(path)
                        ? 'text-blue-600 border-b-2 border-blue-600 pb-4'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="md:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-lg font-bold text-gray-900">
              Social Tracker
            </Link>
            {user && (
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 bottom-nav-shadow z-50">
          <div className="grid grid-cols-5 h-16">
            {mobileNavItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center space-y-1 nav-transition group relative ${
                    active
                      ? 'text-blue-600 bg-blue-50 nav-item-active'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform ${
                    active ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className={`text-xs font-medium transition-all ${
                    active 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-70 group-hover:opacity-100'
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}