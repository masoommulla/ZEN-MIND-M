import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { API_URL } from '../config';

interface JitsiVideoCallProps {
  roomName: string;
  userName: string;
  onEndCall: () => void;
  duration: number; // Session duration in minutes
  sessionEndTime: Date; // When the session should end
  appointmentId?: string; // For calling end-session API
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export function JitsiVideoCall({ roomName, userName, onEndCall, duration, sessionEndTime, appointmentId }: JitsiVideoCallProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const [isLoadingJitsi, setIsLoadingJitsi] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(sessionEndTime);
      const remaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(remaining);
      
      // Auto-end when timer reaches 0
      if (remaining === 0) {
        console.log('⏰ Session time ended, auto-ending call');
        endCall();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionEndTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://8x8.vc/vpaas-magic-cookie-81cc2a07be9a4cb089b78c8f1afafe38/external_api.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.body.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();
        
        if (!jitsiContainerRef.current) return;

        const domain = '8x8.vc';
        const options = {
          roomName: `vpaas-magic-cookie-81cc2a07be9a4cb089b78c8f1afafe38/${roomName}`,
          parentNode: jitsiContainerRef.current,
          width: '100%',
          height: '100%',
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false,
            defaultLanguage: 'en',
            toolbarButtons: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'profile',
              'chat',
              'recording',
              'livestreaming',
              'etherpad',
              'sharedvideo',
              'settings',
              'raisehand',
              'videoquality',
              'filmstrip',
              'feedback',
              'stats',
              'shortcuts',
              'tileview',
              'videobackgroundblur',
              'download',
              'help',
              'mute-everyone'
            ]
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            MOBILE_APP_PROMO: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            DEFAULT_BACKGROUND: '#1a1a1a',
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
            DEFAULT_LOCAL_DISPLAY_NAME: 'You',
            FILM_STRIP_MAX_HEIGHT: 120,
            ENABLE_DIAL_OUT: false,
            ENABLE_FEEDBACK_ANIMATION: false,
            DISABLE_FOCUS_INDICATOR: false,
            DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
            DISABLE_RINGING: false,
            AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
            AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
            POLICY_LOGO: null,
            LOCAL_THUMBNAIL_RATIO: 16 / 9,
            REMOTE_THUMBNAIL_RATIO: 1,
            VERTICAL_FILMSTRIP: true,
            TILE_VIEW_MAX_COLUMNS: 5,
            SETTINGS_SECTIONS: ['devices', 'language'],
            VIDEO_LAYOUT_FIT: 'both'
          }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        // Listen to events
        api.addListener('videoConferenceJoined', () => {
          console.log('✅ Joined video conference');
          setIsJitsiLoaded(true);
        });

        api.addListener('videoConferenceLeft', () => {
          console.log('❌ Left video conference');
          onEndCall();
        });

        api.addListener('audioMuteStatusChanged', (event: any) => {
          setIsAudioMuted(event.muted);
        });

        api.addListener('videoMuteStatusChanged', (event: any) => {
          setIsVideoMuted(event.muted);
        });

        api.addListener('readyToClose', () => {
          onEndCall();
        });

      } catch (error) {
        console.error('Error initializing Jitsi:', error);
        setLoadError('Failed to initialize Jitsi');
      } finally {
        setIsLoadingJitsi(false);
      }
    };

    initializeJitsi();

    // Cleanup
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [roomName, userName, onEndCall]);

  const toggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const endCall = () => {
    // Call end-session API if appointmentId is provided
    if (appointmentId) {
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/booking/end-session/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log('✅ Session ended successfully:', data);
        })
        .catch(error => {
          console.error('❌ Error ending session:', error);
        });
    }
    
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Jitsi Container */}
      <div ref={jitsiContainerRef} className="w-full h-full" />

      {/* Custom Controls Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <Card className="bg-gray-900/90 backdrop-blur-lg border-gray-700 p-4">
          <div className="flex items-center gap-4">
            {/* Microphone Toggle */}
            <Button
              onClick={toggleAudio}
              variant={isAudioMuted ? 'destructive' : 'secondary'}
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              {isAudioMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>

            {/* Video Toggle */}
            <Button
              onClick={toggleVideo}
              variant={isVideoMuted ? 'destructive' : 'secondary'}
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              {isVideoMuted ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </Button>

            {/* End Call */}
            <Button
              onClick={endCall}
              variant="destructive"
              size="lg"
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Loading Indicator */}
      {isLoadingJitsi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-40">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Connecting to session...</p>
          </div>
        </div>
      )}

      {/* Error Indicator */}
      {loadError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-40">
          <div className="text-center">
            <p className="text-red-500 text-lg">Error: {loadError}</p>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <Card className={`backdrop-blur-lg border-gray-700 p-4 ${
          timeRemaining < 300 ? 'bg-red-900/90 animate-pulse' : 'bg-gray-900/90'
        }`}>
          <div className="text-center">
            <p className="text-white text-sm mb-1">Session Time Remaining</p>
            <p className={`text-3xl font-mono ${
              timeRemaining < 300 ? 'text-red-200' : 'text-white'
            }`}>
              {formatTime(timeRemaining)}
            </p>
            {timeRemaining < 300 && (
              <p className="text-red-200 text-xs mt-1">Session ending soon!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}