import Navbar from './Navbar';
import { useAuthStore } from '../../store/authStore';

export default function Layout({ children }) {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${
        user ? 'pb-20 md:pb-6' : '' // Add bottom padding on mobile for bottom nav
      }`}>
        {children}
      </main>
    </div>
  );
}