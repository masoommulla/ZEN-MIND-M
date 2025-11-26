import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Users,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChatbotMascot } from './AnimeCharacters';
import { PageTransition3D } from './3DGraphics';
import { useAuth } from '../contexts/AuthContext';
import { moodAPI, journalAPI, appointmentAPI } from '../services/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch user-specific stats on mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Fetch stats (for future use if needed)
      const moodResponse = await moodAPI.getStats();
      // Note: Removed appointmentAPI.getUpcoming() as it doesn't exist
      const journalResponse = await journalAPI.getStats();

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: MessageCircle, label: 'Chat with AI', path: '/dashboard/chat', color: 'from-purple-500 to-pink-500' },
    { icon: Heart, label: 'Log Mood', path: '/dashboard/mood', color: 'from-pink-500 to-rose-500' },
    { icon: BookOpen, label: 'Journal', path: '/dashboard/journal', color: 'from-blue-500 to-purple-500' },
    { icon: Users, label: 'Find Therapist', path: '/dashboard/therapists', color: 'from-green-500 to-teal-500' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments', color: 'from-orange-500 to-yellow-500' },
    { icon: TrendingUp, label: 'Resources', path: '/dashboard/resources', color: 'from-cyan-500 to-blue-500' }
  ];

  if (!user) {
    return null;
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-6 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-100">
              <div className="flex-1 space-y-2">
                <h1 className="text-gray-800">
                  Welcome back, <span className="font-semibold text-purple-600">{user.name}</span>!
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {/* Chatbot Mascot */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                className="w-32 h-32 flex-shrink-0"
              >
                <ChatbotMascot />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h2 className="text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate(action.path)}
                    className={`w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-br ${action.color} hover:opacity-90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <action.icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="w-6 h-6" />
                  Your Wellness Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-4">
                  You're making great progress on your mental wellness journey. Keep up the amazing work! 💪
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate('/dashboard/mood')}
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    Track Mood
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard/chat')}
                    variant="outline"
                    className="border-white text-white hover:bg-white/20"
                  >
                    Chat with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition3D>
  );
}