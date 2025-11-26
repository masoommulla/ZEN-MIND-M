import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  MessageCircle, 
  Heart, 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface HeaderProps {
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export function Header({ user: propUser, onLogin, onLogout: propOnLogout, onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout: authLogout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const user = propUser || authUser;

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      // Check if we're in hero section (first screen height)
      setIsInHero(scrollY < window.innerHeight - 100);
    });
  }

  const navItems = user ? [
    { icon: TrendingUp, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageCircle, label: 'Chat', path: '/dashboard/chat' },
    { icon: Heart, label: 'Mood', path: '/dashboard/mood' },
    { icon: BookOpen, label: 'Journal', path: '/dashboard/journal' },
    { icon: Users, label: 'Therapists', path: '/dashboard/therapists' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: Sparkles, label: 'Resources', path: '/dashboard/resources' },
  ] : [];

  const handleLogout = () => {
    setMobileMenuOpen(false);
    setShowLogoutDialog(false);
    
    // Use provided onLogout or authLogout
    if (propOnLogout) {
      propOnLogout();
    } else {
      authLogout();
    }
    
    // Navigate to landing page
    navigate('/', { replace: true });
  };

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      // Extract view from path (e.g., '/dashboard/chat' -> 'chat')
      const view = path.split('/').pop() || 'dashboard';
      onNavigate(view);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          user 
            ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-purple-100'
            : isScrolled || location.pathname !== '/'
            ? 'bg-white/95 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          {/* Desktop Layout: Logo Left | Nav Center | Profile Right */}
          <div className="hidden lg:grid lg:grid-cols-3 items-center gap-4">
            {/* LEFT: Logo */}
            <motion.button
              onClick={() => handleNavigation(user ? '/dashboard' : '/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group justify-self-start"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-xl transition-colors duration-300 ${
                  user 
                    ? 'font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent'
                    : isScrolled 
                    ? 'text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text' 
                    : 'text-white drop-shadow-lg'
                }`}>
                  ZEN-MIND
                </span>
                <span className={`text-xs transition-colors duration-300 ${
                  user
                    ? 'text-gray-600'
                    : isScrolled ? 'text-gray-500' : 'text-white/80'
                }`}>
                  Mental Wellness
                </span>
              </div>
            </motion.button>

            {/* CENTER: Navigation */}
            <nav className="flex items-center justify-center gap-1">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg shadow-purple-200'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </>
              ) : (
                <>
                  {/* Landing page navigation links */}
                  <motion.a
                    href="#features"
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 transition-colors ${
                      isScrolled 
                        ? 'text-gray-600 hover:text-purple-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Features
                  </motion.a>
                  <motion.a
                    href="#about"
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 transition-colors ${
                      isScrolled 
                        ? 'text-gray-600 hover:text-purple-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    About
                  </motion.a>
                  <motion.a
                    href="#safe-space"
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 transition-colors ${
                      isScrolled 
                        ? 'text-gray-600 hover:text-purple-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Safe Space
                  </motion.a>
                  <motion.a
                    href="#about-us"
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 transition-colors ${
                      isScrolled 
                        ? 'text-gray-600 hover:text-purple-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    About Us
                  </motion.a>
                </>
              )}
            </nav>

            {/* RIGHT: User Profile & Logout */}
            <div className="flex items-center gap-3 justify-self-end">
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation('/dashboard/settings')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white shadow-md overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </span>
                    </div>
                  </motion.button>

                  <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <AlertDialogTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-all"
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-purple-500" />
                          Confirm Logout
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to log out? You'll need to sign in again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleLogout}
                          className="bg-gradient-to-r from-red-500 to-pink-500"
                        >
                          Yes, Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Button
                    onClick={() => navigate('/therapist-portal')}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Therapist Login
                  </Button>
                  <Button
                    onClick={onLogin || (() => {})}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Layout: Logo | Menu Button */}
          <div className="flex lg:hidden items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => handleNavigation(user ? '/dashboard' : '/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  ZEN-MIND
                </span>
                <span className="text-xs text-gray-500">Mental Wellness</span>
              </div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-purple-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 lg:hidden bg-white pt-20 overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8">
            {user && (
              <>
                <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl shadow-lg overflow-hidden">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2 mb-8">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-purple-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation('/dashboard/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 transition-all"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </motion.button>
                </nav>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </>
            )}

            {!user && (
              <>
                {/* Landing page navigation in mobile */}
                <nav className="space-y-2 mb-6">
                  <motion.a
                    href="#features"
                    onClick={() => setMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 transition-all"
                  >
                    Features
                  </motion.a>
                  <motion.a
                    href="#about"
                    onClick={() => setMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 transition-all"
                  >
                    About
                  </motion.a>
                  <motion.a
                    href="#safe-space"
                    onClick={() => setMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 transition-all"
                  >
                    Safe Space
                  </motion.a>
                  <motion.a
                    href="#about-us"
                    onClick={() => setMobileMenuOpen(false)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 transition-all"
                  >
                    About Us
                  </motion.a>
                </nav>
                
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={onLogin || (() => {})}
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}