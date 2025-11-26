import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Video, 
  User,
  XCircle,
  Home,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PageTransition3D } from './3DGraphics';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI, refundAPI } from '../services/api';
import { JitsiVideoCall } from './JitsiVideoCall';
import { SessionReviewModal } from './SessionReviewModal';
import { API_URL } from '../config';

interface TherapySession {
  _id: string;
  therapistId: any;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  payment: {
    amount: number;
    status: string;
  };
  createdAt: string;
}

export function AppointmentsNew() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<TherapySession | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
    
    // Update current time every minute for real-time validation
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getAll();
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can join session (within 5 minutes before start time)
  const canJoinSession = (session: TherapySession) => {
    // Session can be joined only after 5 minutes from booking (createdAt)
    const bookingTime = new Date(session.createdAt);
    const fiveMinutesAfterBooking = new Date(bookingTime.getTime() + 5 * 60000);
    
    const sessionDate = new Date(session.date);
    const [hours, minutes] = session.startTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    const sessionEndDate = new Date(session.date);
    sessionEndDate.setHours(endHours, endMinutes, 0, 0);

    const now = currentTime;
    
    // Can join only after 5 minutes from booking AND before session end time
    return now >= fiveMinutesAfterBooking && now <= sessionEndDate && session.status === 'scheduled';
  };

  // Check if session has expired (past end time)
  const isSessionExpired = (session: TherapySession) => {
    const sessionDate = new Date(session.date);
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    sessionDate.setHours(endHours, endMinutes, 0, 0);
    
    return currentTime > sessionDate;
  };

  // Filter sessions
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    sessionDate.setHours(endHours, endMinutes, 0, 0);
    
    return session.status === 'scheduled' && sessionDate >= currentTime;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    sessionDate.setHours(endHours, endMinutes, 0, 0);
    
    return session.status === 'completed' || session.status === 'cancelled' || sessionDate < currentTime;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session? You will receive a refund with 10% deduction.')) {
      return;
    }

    try {
      const response = await refundAPI.cancelWithRefund(sessionId, 'Cancelled by user');
      if (response.success) {
        toast.success('Session cancelled. Refund processed with 10% deduction.');
        loadAppointments(); // Reload
      }
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast.error(error.message || 'Failed to cancel session');
    }
  };

  const handleJoinSession = async (session: TherapySession) => {
    if (!canJoinSession(session)) {
      toast.error('You can only join the session within 5 minutes before start time');
      return;
    }

    try {
      const response = await appointmentAPI.joinSession(session._id);
      if (response.success) {
        setActiveSession(session);
        setIsInCall(true);
      } else {
        toast.error(response.message || 'Failed to join session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to join session');
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    if (activeSession) {
      setReviewModalOpen(true);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  if (isInCall && activeSession) {
    // Calculate session end time
    const sessionDate = new Date(activeSession.date);
    const [hours, minutes] = activeSession.startTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    const sessionEndTime = new Date(sessionDate.getTime() + activeSession.duration * 60000);

    return (
      <JitsiVideoCall
        roomName={`session-${activeSession._id}`}
        userName="Teen User"
        onEndCall={handleEndCall}
        duration={activeSession.duration}
        sessionEndTime={sessionEndTime}
        appointmentId={activeSession._id}
      />
    );
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                My Appointments
              </h1>
              <p className="text-gray-600">Manage your therapy sessions</p>
            </motion.div>

            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === 'past'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </div>

          {/* Sessions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading appointments...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'upcoming' && (
                  <motion.div
                    key="upcoming"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {upcomingSessions.length === 0 ? (
                      <Card className="p-12 text-center border-2 border-purple-100">
                        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No upcoming appointments</p>
                        <Button
                          onClick={() => navigate('/dashboard/therapists')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          Book a Session
                        </Button>
                      </Card>
                    ) : (
                      upcomingSessions.map((session, index) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {/* Therapist Info */}
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl">
                                    {session.therapistId?.profilePicture ? (
                                      <img
                                        src={session.therapistId.profilePicture}
                                        alt={session.therapistId.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-8 h-8" />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="text-lg mb-1">
                                      {session.therapistId?.name || 'Therapist'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(session.date)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                        ₹{session.payment.amount}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  {canJoinSession(session) ? (
                                    <Button
                                      onClick={() => handleJoinSession(session)}
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                    >
                                      <Video className="w-4 h-4 mr-2" />
                                      Join Session
                                    </Button>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      Available 5 min before start
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'past' && (
                  <motion.div
                    key="past"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {pastSessions.length === 0 ? (
                      <Card className="p-12 text-center border-2 border-purple-100">
                        <p className="text-gray-600">No past appointments</p>
                      </Card>
                    ) : (
                      pastSessions.map((session, index) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-2 border-gray-100 opacity-75">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl">
                                    {session.therapistId?.profilePicture ? (
                                      <img
                                        src={session.therapistId.profilePicture}
                                        alt={session.therapistId.name}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-8 h-8" />
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="text-lg mb-1">
                                      {session.therapistId?.name || 'Therapist'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(session.date)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatTime(session.startTime)}</span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={
                                          session.status === 'completed' 
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }
                                      >
                                        {session.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Delete Button for Past Sessions */}
                                <Button
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      const response = await fetch(`${API_URL}/api/appointments/${session._id}`, {
                                        method: 'DELETE',
                                        headers: {
                                          'Authorization': `Bearer ${token}`
                                        }
                                      });
                                      const data = await response.json();
                                      if (data.success) {
                                        toast.success('Session deleted from history');
                                        loadAppointments();
                                      } else {
                                        toast.error(data.message || 'Failed to delete session');
                                      }
                                    } catch (error: any) {
                                      console.error('Delete error:', error);
                                      toast.error('Failed to delete session');
                                    }
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {reviewModalOpen && activeSession && (
          <SessionReviewModal
            sessionId={activeSession._id}
            therapistId={
              typeof activeSession.therapistId === 'object' 
                ? activeSession.therapistId._id 
                : activeSession.therapistId
            }
            onClose={() => {
              setReviewModalOpen(false);
              setActiveSession(null);
              loadAppointments();
            }}
          />
        )}
      </div>
    </PageTransition3D>
  );
}