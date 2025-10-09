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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl z-50">
          <div className="grid grid-cols-5 h-16 px-2">
            {mobileNavItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center space-y-1 rounded-xl mx-1 my-2 transition-all duration-300 group relative overflow-hidden ${
                    active
                      ? 'text-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 hover:scale-105'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    active ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'
                  }`} />
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    active 
                      ? 'opacity-100 font-semibold drop-shadow-sm' 
                      : 'opacity-70 group-hover:opacity-100 group-hover:font-semibold'
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-xl" />
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