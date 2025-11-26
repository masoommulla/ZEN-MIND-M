import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Music, 
  Gamepad2, 
  Heart, 
  Sparkles,
  Youtube,
  Clock,
  TrendingUp,
  Headphones,
  Smile,
  Book,
  Brain,
  Zap,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FloatingSphere, FloatingCube, Animated3DBackground, PageTransition3D } from './3DGraphics';
import { HappyCharacter, CalmCharacter, ChatbotMascot } from './AnimeCharacters';
import { SparkleEffect, HeartPulse, CloudShape } from './DecorativeElements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MiniGames } from './MiniGames';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';

interface ResourcesProps {
  onBack?: () => void;
}

interface VideoResource {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  duration: string;
  views: string;
}

interface MusicResource {
  id: string;
  title: string;
  artist: string;
  description: string;
  spotifyUrl: string;
  youtubeUrl: string;
  mood: string;
  duration: string;
  thumbnail: string;
}

export function Resources({ onBack }: ResourcesProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);

  const motivationalVideos: VideoResource[] = [
    {
      id: '1',
      title: 'You Are Enough - Teen Motivation',
      description: 'A powerful message for teens about self-worth and believing in yourself',
      youtubeId: 'tYzMYcUty6s',
      category: 'Self-Worth',
      duration: '3:45',
      views: '2.1M'
    },
    {
      id: '2',
      title: 'Dealing with Anxiety & Stress',
      description: 'Practical tips and techniques for managing anxiety as a teenager',
      youtubeId: 'WWloIAQpMcQ',
      category: 'Mental Health',
      duration: '8:12',
      views: '1.5M'
    },
    {
      id: '3',
      title: 'Growth Mindset for Students',
      description: 'Learn how to develop a growth mindset and overcome challenges',
      youtubeId: 'KUWn_TJTrnU',
      category: 'Growth',
      duration: '5:30',
      views: '890K'
    },
    {
      id: '4',
      title: 'The Power of Positive Thinking',
      description: 'Transform your mindset with the science of positive psychology',
      youtubeId: 'z-IR48Mb3W0',
      category: 'Positivity',
      duration: '6:15',
      views: '3.2M'
    },
    {
      id: '5',
      title: 'Meditation for Beginners',
      description: 'Simple guided meditation to reduce stress and find inner peace',
      youtubeId: 'inpok4MKVLM',
      category: 'Mindfulness',
      duration: '10:00',
      views: '5.4M'
    },
    {
      id: '6',
      title: 'Building Self-Confidence',
      description: 'Steps to boost your confidence and believe in your abilities',
      youtubeId: 'lw3mDJ0qdp0',
      category: 'Confidence',
      duration: '7:22',
      views: '1.8M'
    }
  ];

  const calmingMusic: MusicResource[] = [
    {
      id: '1',
      title: 'Lofi Hip Hop - Study & Relax',
      artist: 'ChilledCow',
      description: 'Perfect background music for studying or relaxing',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
      youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      mood: 'Chill',
      duration: '24/7 Live',
      thumbnail: 'lofi-study'
    },
    {
      id: '2',
      title: 'Nature Sounds - Forest Ambience',
      artist: 'Relaxing Sounds',
      description: 'Peaceful forest sounds for meditation and sleep',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
      youtubeUrl: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
      mood: 'Peaceful',
      duration: '3:00:00',
      thumbnail: 'nature-forest'
    },
    {
      id: '3',
      title: 'Piano Relaxing Music',
      artist: 'Peaceful Piano',
      description: 'Beautiful piano melodies to calm your mind',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
      youtubeUrl: 'https://www.youtube.com/watch?v=8EI_RaeKLOk',
      mood: 'Calm',
      duration: '2:30:00',
      thumbnail: 'piano-peaceful'
    },
    {
      id: '4',
      title: 'Uplifting Pop Hits',
      artist: 'Feel Good Playlist',
      description: 'Happy songs to boost your mood instantly',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
      youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
      mood: 'Happy',
      duration: '1:45:00',
      thumbnail: 'pop-happy'
    },
    {
      id: '5',
      title: 'Acoustic Chill Vibes',
      artist: 'Indie Acoustic',
      description: 'Soft acoustic tracks for peaceful moments',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
      youtubeUrl: 'https://www.youtube.com/watch?v=2OEL4P1Rz04',
      mood: 'Mellow',
      duration: '2:00:00',
      thumbnail: 'acoustic-chill'
    },
    {
      id: '6',
      title: 'Rain Sounds for Sleep',
      artist: 'Sleep Sounds',
      description: 'Gentle rain sounds to help you relax and sleep',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
      youtubeUrl: 'https://www.youtube.com/watch?v=nDq6TstdEi8',
      mood: 'Sleepy',
      duration: '8:00:00',
      thumbnail: 'rain-sleep'
    }
  ];

  return (
    <PageTransition3D>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Animated 3D Background */}
        <Animated3DBackground />

        {/* Floating 3D Elements */}
        <FloatingSphere color="purple" size={120} top="10%" left="5%" />
        <FloatingSphere color="pink" size={80} top="70%" right="10%" />
        <FloatingCube color="blue" size={60} top="40%" right="5%" />
        <FloatingCube color="purple" size={90} top="60%" left="8%" />

        {/* Decorative Elements */}
        <CloudShape className="absolute top-20 right-20 w-64 opacity-20" color="purple" />
        <CloudShape className="absolute bottom-40 left-20 w-56 opacity-20" color="pink" />
        <SparkleEffect className="absolute top-40 left-1/4 w-20 opacity-30" />
        <HeartPulse className="absolute bottom-20 right-1/3 w-24 opacity-30" />

        {/* Home Button to Dashboard */}
        <Button
          className="fixed top-6 left-6 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          onClick={() => onBack ? onBack() : navigate('/dashboard')}
        >
          <Home className="w-5 h-5" />
        </Button>

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center gap-6 mb-6">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20"
              >
                <HappyCharacter />
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className="w-24 h-24"
              >
                <CalmCharacter />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="w-20 h-20"
              >
                <ChatbotMascot />
              </motion.div>
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Mood Refresh Zone
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Your personal space to relax, recharge, and feel amazing! ✨ 
              Explore motivational videos, calming music, and fun games.
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 backdrop-blur-md border-2 border-purple-200/50 p-2 rounded-2xl">
              <TabsTrigger 
                value="videos" 
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger 
                value="music"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300"
              >
                <Music className="w-4 h-4 mr-2" />
                Music
              </TabsTrigger>
              <TabsTrigger 
                value="games"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games
              </TabsTrigger>
            </TabsList>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {motivationalVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-purple-200/50 bg-white/80 backdrop-blur-sm group cursor-pointer">
                        <div 
                          onClick={() => setSelectedVideo(video)}
                          className="relative"
                        >
                          <AspectRatio ratio={16 / 9}>
                            <div className="relative w-full h-full bg-gradient-to-br from-purple-400 to-pink-400">
                              <img
                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-pink-500 transition-all">
                                  <Play className="w-8 h-8 text-purple-600 group-hover:text-white ml-1" />
                                </div>
                              </motion.div>
                            </div>
                          </AspectRatio>
                          <Badge className="absolute top-3 right-3 bg-purple-500">
                            {video.category}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {video.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {video.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {video.views} views
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calmingMusic.map((music, index) => (
                    <motion.div
                      key={music.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-pink-200/50 bg-white/80 backdrop-blur-sm group">
                        <div className="relative h-48 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Headphones className="w-24 h-24 text-white/80" />
                            </motion.div>
                          </div>
                          <Badge className="absolute top-3 right-3 bg-pink-500">
                            {music.mood}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{music.title}</CardTitle>
                          <CardDescription className="text-purple-600">
                            {music.artist}
                          </CardDescription>
                          <CardDescription className="line-clamp-2">
                            {music.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {music.duration}
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={music.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center gap-2"
                              >
                                <Youtube className="w-4 h-4" />
                                YouTube
                              </motion.button>
                            </a>
                            <a
                              href={music.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1"
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                              >
                                <Music className="w-4 h-4" />
                                Spotify
                              </motion.button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Music Categories */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  {[
                    { icon: Brain, title: 'Focus & Study', color: 'from-blue-400 to-cyan-400', emoji: '📚' },
                    { icon: Heart, title: 'Sleep & Relax', color: 'from-purple-400 to-pink-400', emoji: '😴' },
                    { icon: Zap, title: 'Energy Boost', color: 'from-orange-400 to-yellow-400', emoji: '⚡' }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Card className={`bg-gradient-to-r ${category.color} border-0 text-white cursor-pointer hover:scale-105 transition-transform`}>
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-2">{category.emoji}</div>
                          <h3 className="text-white mb-1">{category.title}</h3>
                          <p className="text-white/80 text-sm">Curated playlists</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Games Tab */}
            <TabsContent value="games">
              <MiniGames />
            </TabsContent>
          </Tabs>
        </div>

        {/* Video Player Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-5xl w-full shadow-2xl my-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative bg-black">
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="mb-2 text-lg sm:text-2xl">{selectedVideo.title}</h2>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">{selectedVideo.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <Badge variant="secondary">{selectedVideo.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {selectedVideo.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          {selectedVideo.views} views
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedVideo(null)}
                      className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition3D>
  );
}