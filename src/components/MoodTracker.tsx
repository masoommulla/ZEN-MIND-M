import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar as CalendarIcon, TrendingUp, Save, Trash2, X, Sparkles, BookOpen, Music, Dumbbell, Brain, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  HappyCharacter,
  CalmCharacter,
  ThinkingCharacter,
  SupportiveCharacter
} from './AnimeCharacters';
import {
  AnxiousCharacter,
  ExcitedCharacter,
  SadCharacter,
  ConfusedCharacter,
  AngryCharacter,
  SleepyCharacter
} from './MoodCharacters';
import { SparkleEffect } from './DecorativeElements';
import { PageTransition3D } from './3DGraphics';
import { toast } from 'sonner';
import { moodAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function MoodTracker() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'log' | 'history'>('log');
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch mood history on mount
  useEffect(() => {
    if (user) {
      fetchMoodHistory();
    }
  }, [user]);

  const fetchMoodHistory = async () => {
    try {
      const response = await moodAPI.getMoods();
      if (response.success) {
        setMoodHistory(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const emotions = [
    { name: 'Happy', emoji: '😊', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { name: 'Sad', emoji: '😢', color: 'bg-blue-100 hover:bg-blue-200' },
    { name: 'Anxious', emoji: '😰', color: 'bg-purple-100 hover:bg-purple-200' },
    { name: 'Angry', emoji: '😠', color: 'bg-red-100 hover:bg-red-200' },
    { name: 'Calm', emoji: '😌', color: 'bg-green-100 hover:bg-green-200' },
    { name: 'Stressed', emoji: '😓', color: 'bg-orange-100 hover:bg-orange-200' },
    { name: 'Excited', emoji: '🤩', color: 'bg-pink-100 hover:bg-pink-200' },
    { name: 'Lonely', emoji: '😔', color: 'bg-gray-100 hover:bg-gray-200' },
    { name: 'Confused', emoji: '😕', color: 'bg-indigo-100 hover:bg-indigo-200' },
    { name: 'Energetic', emoji: '⚡', color: 'bg-yellow-100 hover:bg-yellow-200' }
  ];

  const activities = [
    { name: 'Exercise', emoji: '🏃' },
    { name: 'Social', emoji: '👥' },
    { name: 'Sleep', emoji: '😴' },
    { name: 'School', emoji: '📚' },
    { name: 'Family', emoji: '👨‍👩‍👧' },
    { name: 'Hobbies', emoji: '🎨' },
    { name: 'Meditation', emoji: '🧘' },
    { name: 'Music', emoji: '🎵' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'Outdoor', emoji: '🌳' }
  ];

  const moodCharacters = [
    { mood: 1, character: SadCharacter, label: 'Very Low', color: 'from-red-500 to-red-600' },
    { mood: 2, character: AngryCharacter, label: 'Low', color: 'from-orange-500 to-red-500' },
    { mood: 3, character: AnxiousCharacter, label: 'Below Average', color: 'from-orange-400 to-orange-500' },
    { mood: 4, character: ConfusedCharacter, label: 'Fair', color: 'from-yellow-400 to-orange-400' },
    { mood: 5, character: ThinkingCharacter, label: 'Okay', color: 'from-yellow-400 to-yellow-500' },
    { mood: 6, character: CalmCharacter, label: 'Good', color: 'from-green-400 to-yellow-400' },
    { mood: 7, character: HappyCharacter, label: 'Very Good', color: 'from-green-500 to-green-600' },
    { mood: 8, character: SupportiveCharacter, label: 'Great', color: 'from-green-600 to-teal-500' },
    { mood: 9, character: ExcitedCharacter, label: 'Excellent', color: 'from-teal-500 to-blue-500' },
    { mood: 10, character: ExcitedCharacter, label: 'Amazing!', color: 'from-blue-500 to-purple-500' }
  ];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  // Map intensity (1-10) to mood enum for backend
  const mapIntensityToMood = (intensity: number): string => {
    if (intensity <= 2) return 'sad';
    if (intensity <= 3) return 'anxious';
    if (intensity <= 4) return 'stressed';
    if (intensity === 5) return 'okay';
    if (intensity <= 7) return 'good';
    if (intensity <= 9) return 'amazing';
    return 'amazing';
  };

  const handleSave = async () => {
    if (selectedEmotions.length === 0) {
      toast.error('Please select at least one emotion');
      return;
    }

    const moodData = {
      mood: mapIntensityToMood(intensity),
      intensity: intensity,
      emotions: selectedEmotions,
      activities: [],
      notes: notes || undefined
    };

    try {
      setLoading(true);
      const response = await moodAPI.addMood(moodData);
      console.log('=== MOOD API RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Response.success:', response.success);
      console.log('Response.data:', response.data);
      console.log('Response.data.suggestion:', response.data?.suggestion);
      
      if (response.success) {
        toast.success('Mood logged successfully! 🎉');
        
        // Show suggestion if available - the suggestion is IN the mood data object
        if (response.data && response.data.suggestion) {
          console.log('✅ Suggestion found! Displaying modal...');
          console.log('Suggestion details:', JSON.stringify(response.data.suggestion, null, 2));
          setCurrentSuggestion(response.data.suggestion);
          setShowSuggestion(true);
        } else {
          console.log('❌ No suggestion in response.');
          console.log('Response.data type:', typeof response.data);
          console.log('Response.data keys:', response.data ? Object.keys(response.data) : 'N/A');
        }
        
        fetchMoodHistory();
        // Reset form but keep modal open if suggestion exists
        setIntensity(5);
        setSelectedEmotions([]);
        setNotes('');
      } else {
        toast.error('Failed to log mood. Please try again.');
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMood = async (moodId: string) => {
    try {
      const response = await moodAPI.deleteMood(moodId);
      if (response.success) {
        toast.success('Mood entry deleted successfully!');
        fetchMoodHistory();
      } else {
        toast.error('Failed to delete mood entry.');
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
      toast.error('Failed to delete mood entry.');
    }
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  const handleViewSuggestion = (suggestion: any) => {
    setCurrentSuggestion(suggestion);
    setShowSuggestion(true);
  };

  const currentCharacter = moodCharacters.find(m => m.mood === parseInt(selectedMood)) || moodCharacters[4];

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-8 pb-8 overflow-hidden">
        {/* Home Button - Top Left */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHome}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          title="Back to Dashboard"
        >
          <Home className="w-6 h-6" />
        </motion.button>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            Mood Tracker
          </h1>
          <p className="text-gray-600">
            Track your emotions to understand your mental health journey
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 mb-6"
        >
          <Button
            onClick={() => setView('log')}
            variant={view === 'log' ? 'default' : 'outline'}
            className={view === 'log' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
          >
            Log Mood
          </Button>
          <Button
            onClick={() => setView('history')}
            variant={view === 'history' ? 'default' : 'outline'}
            className={view === 'history' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            History
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'log' ? (
            <motion.div
              key="log"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Mood Scale */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>How are you feeling? (1-10)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Character Display */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        key={selectedMood}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-48 h-48 mb-4"
                      >
                        <currentCharacter.character />
                      </motion.div>
                      <motion.div
                        key={`label-${selectedMood}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`px-6 py-3 rounded-full bg-gradient-to-r ${currentCharacter.color} text-white shadow-lg`}
                      >
                        {currentCharacter.label}
                      </motion.div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={intensity}
                          onChange={(e) => setIntensity(parseInt(e.target.value))}
                          className="w-full h-3 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, 
                              rgb(239, 68, 68) 0%, 
                              rgb(251, 146, 60) 30%, 
                              rgb(250, 204, 21) 50%, 
                              rgb(132, 204, 22) 70%, 
                              rgb(34, 197, 94) 100%)`
                          }}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>😔 1</span>
                          <span className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {intensity}
                          </span>
                          <span>😊 10</span>
                        </div>
                      </div>

                      {/* Mood Scale Visual */}
                      <div className="grid grid-cols-10 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <motion.button
                            key={num}
                            onClick={() => setIntensity(num)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                              intensity === num
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emotions */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>What emotions are you experiencing?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {emotions.map((emotion, index) => (
                      <motion.button
                        key={emotion.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleEmotion(emotion.name)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          selectedEmotions.includes(emotion.name)
                            ? 'border-purple-500 bg-purple-100 shadow-lg'
                            : `border-gray-200 ${emotion.color}`
                        }`}
                      >
                        <div className="text-4xl mb-2">{emotion.emoji}</div>
                        <div className="text-sm text-gray-700">{emotion.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>Additional Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind? Any thoughts you'd like to remember?"
                    className="resize-none"
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500 mt-2 text-right">
                    {notes.length}/200 characters
                  </p>
                </CardContent>
              </Card>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSave}
                  className="w-full py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90 text-lg"
                  size="lg"
                  disabled={loading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Mood Entry'}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    Mood History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {moodHistory.length > 0 ? (
                    <div className="space-y-4">
                      {moodHistory.slice().reverse().map((entry, index) => (
                        <motion.div
                          key={entry._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${
                                moodCharacters.find(m => m.mood === entry.intensity)?.color || 'from-gray-400 to-gray-500'
                              }`}>
                                <span className="text-white text-xl">{entry.intensity}</span>
                              </div>
                              <div>
                                <p className="text-gray-800">{
                                  moodCharacters.find(m => m.mood === entry.intensity)?.label || 'Mood'
                                }</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(entry.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMood(entry._id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {entry.emotions.map(emotion => (
                                <Badge key={emotion} variant="secondary" className="bg-purple-100 text-purple-700">
                                  {emotions.find(e => e.name === emotion)?.emoji} {emotion}
                                </Badge>
                              ))}
                            </div>
                            
                            {entry.activities.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {entry.activities.map(activity => (
                                  <Badge key={activity} variant="outline" className="border-pink-300 text-pink-700">
                                    {activities.find(a => a.name === activity)?.emoji} {activity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {entry.notes && (
                              <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                                "{entry.notes}"
                              </p>
                            )}

                            {entry.suggestion && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewSuggestion(entry.suggestion)}
                                className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                                View Suggestion
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto mb-4">
                        <ThinkingCharacter />
                      </div>
                      <p className="text-gray-600">No mood entries yet. Start tracking your mood!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Suggestion Modal */}
        <AnimatePresence>
          {showSuggestion && currentSuggestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowSuggestion(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-4 border-purple-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                    <h3 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Personalized Suggestions
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSuggestion(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Calm Down Activity */}
                  {currentSuggestion.activity && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-purple-700 mb-2">Calm Down Activity</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {currentSuggestion.activity}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Book Recommendation */}
                  {currentSuggestion.book && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border-2 border-green-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-green-700 mb-2">Book Recommendation</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {currentSuggestion.book}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Song Suggestion */}
                  {currentSuggestion.song && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-pink-700 mb-2">Song Suggestion</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {currentSuggestion.song}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Exercise Suggestion */}
                  {currentSuggestion.exercise && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-orange-700 mb-2">Exercise Suggestion</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {currentSuggestion.exercise}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowSuggestion(false)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    Got it! Thanks 💜
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition3D>
  );
}