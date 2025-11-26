import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from './Header';
import { FloatingParticles } from './FloatingParticles';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check if we should hide the header
  const hideHeader = ['/dashboard/chat', '/dashboard/mood', '/dashboard/journal', '/dashboard/therapists', '/dashboard/appointments', '/dashboard/resources', '/dashboard/settings'].includes(location.pathname);
  
  // Check if we're on main dashboard (show particles only there)
  const isMainDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background Effects - Removed from all dashboard pages */}
      {/* FloatingParticles removed as requested */}
      
      {/* Header - Hide for specific routes */}
      {!hideHeader && (
        <Header 
          user={user} 
          onNavigate={(view) => {
            if (view === 'landing') {
              navigate('/');
            } else {
              navigate(`/dashboard/${view}`);
            }
          }}
        />
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}