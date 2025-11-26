import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Video, MessageCircle, Phone, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FloatingBackButton } from './FloatingBackButton';
import { Animated3DBackground, PageTransition3D } from './3DGraphics';
import { FloatingSticker } from './DecorativeElements';
import { Session } from '../types/therapist';
import { HappyCharacter, CalmCharacter } from './AnimeCharacters';
import { toast } from 'sonner';

interface SessionManagerProps {
  onBack: () => void;
  onStartVideo: () => void;
  onStartChat: () => void;
}

export function SessionManager({ onBack, onStartVideo, onStartChat }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('therapySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled');

  const handleCancelSession = (sessionId: string) => {
    const updatedSessions = sessions.map(s =>
      s.id === sessionId ? { ...s, status: 'cancelled' as const } : s
    );
    setSessions(updatedSessions);
    localStorage.setItem('therapySessions', JSON.stringify(updatedSessions));
    toast.success('Session cancelled');
  };

  const handleReschedule = (sessionId: string) => {
    toast.info('Rescheduling feature coming soon!');
  };

  const handleJoinSession = (session: Session) => {
    // Check payment status before allowing session
    if (session.paymentStatus !== 'paid') {
      toast.error('Payment required to join this session');
      return;
    }

    if (session.type === 'video') {
      onStartVideo();
    } else if (session.type === 'chat') {
      onStartChat();
    } else {
      toast.info('Phone call will start at scheduled time');
    }
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Cancelled</Badge>;
      case 'in-progress':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-300">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const SessionCard = ({ session }: { session: Session }) => (
    <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                {getSessionIcon(session.type)}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{session.therapistName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{session.time}</span>
                </div>
                {getStatusBadge(session.status)}
              </div>
            </div>

            {session.status === 'scheduled' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleReschedule(session.id)}>
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleCancelSession(session.id)}
                    className="text-red-600"
                  >
                    Cancel Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {session.notes && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Notes:</strong> {session.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="capitalize">{session.type}</span> • {session.duration} minutes
            </div>

            {session.status === 'scheduled' && (
              <Button
                onClick={() => handleJoinSession(session)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                size="sm"
              >
                Join Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
  );

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        <Animated3DBackground />
        <FloatingBackButton onBack={onBack} label="Back" onHome={onBack} />

        <FloatingSticker emoji="📅" className="absolute top-20 right-20" delay={0} />
        <FloatingSticker emoji="✨" className="absolute bottom-40 left-20" delay={1} />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              My Sessions
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your therapy appointments and track your progress
            </p>
          </motion.div>

          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 mx-auto mb-6">
                <CalmCharacter />
              </div>
              <h3 className="text-xl mb-2 text-gray-700">No Sessions Yet</h3>
              <p className="text-gray-600 mb-6">
                Book your first session with a therapist to get started
              </p>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                Browse Therapists
              </Button>
            </motion.div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl mx-auto">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingSessions.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedSessions.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({cancelledSessions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No upcoming sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {upcomingSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <SessionCard session={session} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4">
                      <HappyCharacter />
                    </div>
                    <p className="text-gray-600">No completed sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SessionCard session={session} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled">
                {cancelledSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No cancelled sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cancelledSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SessionCard session={session} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageTransition3D>
  );
}