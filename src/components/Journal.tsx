import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Calendar as CalendarIcon,
  CheckSquare,
  Mic,
  Video,
  FileText,
  Save,
  Trash2,
  Edit,
  Search,
  Filter,
  Sparkles,
  Heart,
  Star,
  BookMarked,
  Clock,
  Tag,
  Lightbulb,
  GraduationCap,
  Brain,
  Target,
  Home
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { PageTransition3D } from './3DGraphics';
import { HappyCharacter, ThinkingCharacter } from './AnimeCharacters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { journalAPI, todoAPI, studyPlanAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface JournalProps {
  onBack: () => void;
}

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  type: 'text' | 'voice' | 'video';
  createdAt: string;
  tags: string[];
  mood?: string;
  isFavorite: boolean;
  category: string;
  voiceNote?: string;
  videoNote?: string;
}

interface TodoItem {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  category: 'personal' | 'study' | 'health' | 'other';
  priority: 'low' | 'medium' | 'high';
}

interface StudySession {
  _id: string;
  subject: string;
  topic: string;
  duration: number;
  createdAt: string;
  notes: string;
  completed: boolean;
}

const journalPrompts = [
  "What made you smile today?",
  "What's something you're grateful for right now?",
  "Describe a challenge you faced and how you handled it.",
  "What's one thing you learned about yourself today?",
  "Write about a person who positively impacted your day.",
  "What are three things you want to accomplish this week?",
  "How are you feeling right now? Explore those emotions.",
  "What's a goal you're working towards and why is it important?",
  "Describe your perfect day from start to finish.",
  "What would you tell your past self from one year ago?",
  "What's something you're proud of this month?",
  "Write a letter to your future self.",
  "What's worrying you right now? How can you address it?",
  "Describe a moment when you felt truly happy.",
  "What's something new you'd like to try?"
];

const moodEmojis = ['😊', '😔', '😴', '😤', '🤩', '😰', '😌', '🤗', '😢', '🎉'];

export function Journal({ onBack }: JournalProps) {
  const [activeView, setActiveView] = useState<'entries' | 'new' | 'todos' | 'study' | 'calendar'>('entries');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    type: 'text' as 'text' | 'voice' | 'video',
    tags: [] as string[],
    mood: '',
    category: 'personal',
    voiceNote: '',
    videoNote: ''
  });

  // New todo form state
  const [newTodo, setNewTodo] = useState({
    text: '',
    category: 'personal' as 'personal' | 'study' | 'health' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // New study session state
  const [newStudySession, setNewStudySession] = useState({
    subject: '',
    topic: '',
    duration: 30,
    notes: ''
  });

  useEffect(() => {
    // Set random prompt on mount
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
    
    // Load data from backend
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load journal entries
      const journalResponse = await journalAPI.getAll();
      if (journalResponse.success) {
        setJournalEntries(journalResponse.data.map((entry: any) => ({
          ...entry,
          type: entry.type || 'text',
          category: entry.category || 'personal',
          isFavorite: entry.isFavorite || false
        })));
      }

      // Load todos
      const todoResponse = await todoAPI.getAll();
      if (todoResponse.success) {
        setTodos(todoResponse.data);
      }

      // Load study sessions
      const studyResponse = await studyPlanAPI.getAll();
      if (studyResponse.success) {
        setStudySessions(studyResponse.data);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const saveJournalEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in the title and content!');
      return;
    }

    setLoading(true);
    try {
      if (editingEntry) {
        // Update existing entry
        const response = await journalAPI.update(editingEntry._id, {
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
          tags: newEntry.tags,
          category: newEntry.category,
          type: newEntry.type,
          voiceNote: newEntry.voiceNote,
          videoNote: newEntry.videoNote
        });

        if (response.success) {
          setJournalEntries(journalEntries.map(e => 
            e._id === editingEntry._id ? { ...response.data, isFavorite: editingEntry.isFavorite } : e
          ));
          toast.success('Entry updated successfully!');
        }
      } else {
        // Create new entry
        const response = await journalAPI.create({
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
          tags: newEntry.tags
        });

        if (response.success) {
          setJournalEntries([{
            ...response.data,
            type: newEntry.type,
            category: newEntry.category,
            isFavorite: false,
            voiceNote: newEntry.voiceNote,
            videoNote: newEntry.videoNote
          }, ...journalEntries]);
          toast.success('Entry saved successfully!');
        }
      }

      // Reset form
      setNewEntry({
        title: '',
        content: '',
        type: 'text',
        tags: [],
        mood: '',
        category: 'personal',
        voiceNote: '',
        videoNote: ''
      });
      setEditingEntry(null);
      setActiveView('entries');
    } catch (error: any) {
      console.error('Error saving entry:', error);
      toast.error(error.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const deleteJournalEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    setLoading(true);
    try {
      const response = await journalAPI.delete(id);
      if (response.success) {
        setJournalEntries(journalEntries.filter(e => e._id !== id));
        toast.success('Entry deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast.error(error.message || 'Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const response = await journalAPI.toggleFavorite(id);
      if (response.success) {
        setJournalEntries(journalEntries.map(e =>
          e._id === id ? { ...e, isFavorite: !e.isFavorite } : e
        ));
        toast.success(response.data.isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Failed to update favorite');
    }
  };

  const addTodo = async () => {
    if (!newTodo.text) {
      toast.error('Please enter a task!');
      return;
    }

    setLoading(true);
    try {
      const response = await todoAPI.create({
        text: newTodo.text,
        category: newTodo.category,
        priority: newTodo.priority
      });

      if (response.success) {
        setTodos([response.data, ...todos]);
        setNewTodo({ text: '', category: 'personal', priority: 'medium' });
        toast.success('Task added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding todo:', error);
      toast.error(error.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await todoAPI.toggle(id);
      if (response.success) {
        setTodos(todos.map(t => t._id === id ? response.data : t));
        toast.success(response.data.completed ? 'Task completed!' : 'Task marked as incomplete');
      }
    } catch (error: any) {
      console.error('Error toggling todo:', error);
      toast.error(error.message || 'Failed to update task');
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    try {
      const response = await todoAPI.delete(id);
      if (response.success) {
        setTodos(todos.filter(t => t._id !== id));
        toast.success('Task deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const addStudySession = async () => {
    if (!newStudySession.subject || !newStudySession.topic) {
      toast.error('Please fill in subject and topic!');
      return;
    }

    setLoading(true);
    try {
      const response = await studyPlanAPI.create({
        subject: newStudySession.subject,
        topic: newStudySession.topic,
        duration: newStudySession.duration,
        notes: newStudySession.notes
      });

      if (response.success) {
        setStudySessions([response.data, ...studySessions]);
        setNewStudySession({ subject: '', topic: '', duration: 30, notes: '' });
        toast.success('Study session added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding study session:', error);
      toast.error(error.message || 'Failed to add study session');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudySession = async (id: string) => {
    try {
      const response = await studyPlanAPI.toggle(id);
      if (response.success) {
        setStudySessions(studySessions.map(s => s._id === id ? response.data : s));
        toast.success(response.data.completed ? 'Study session completed!' : 'Study session marked as incomplete');
      }
    } catch (error: any) {
      console.error('Error toggling study session:', error);
      toast.error(error.message || 'Failed to update study session');
    }
  };

  const deleteStudySession = async (id: string) => {
    setLoading(true);
    try {
      const response = await studyPlanAPI.delete(id);
      if (response.success) {
        setStudySessions(studySessions.filter(s => s._id !== id));
        toast.success('Study session deleted successfully!');
      }
    } catch (error: any) {
      console.error('Error deleting study session:', error);
      toast.error(error.message || 'Failed to delete study session');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/dashboard');
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getNewPrompt = () => {
    const newPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setCurrentPrompt(newPrompt);
  };

  const startEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      type: entry.type,
      tags: entry.tags,
      mood: entry.mood || '',
      category: entry.category,
      voiceNote: entry.voiceNote || '',
      videoNote: entry.videoNote || ''
    });
    setActiveView('new');
  };

  return (
    <PageTransition3D>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center gap-4 mb-6">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-20 h-20"
              >
                <HappyCharacter />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }}
                className="w-24 h-24"
              >
                <ThinkingCharacter />
              </motion.div>
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              My Journal Space
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Your personal sanctuary for thoughts, goals, and growth 📖✨
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: 'entries', label: 'Journal Entries', icon: BookOpen },
                { id: 'new', label: 'New Entry', icon: Plus },
                { id: 'todos', label: 'To-Do Lists', icon: CheckSquare },
                { id: 'study', label: 'Study Planner', icon: GraduationCap },
                { id: 'calendar', label: 'Calendar', icon: CalendarIcon }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all ${
                    activeView === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Journal Entries View */}
            {activeView === 'entries' && (
              <motion.div
                key="entries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Search and Filter */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="Search entries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="goals">Goals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Entries Grid */}
                {filteredEntries.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-20 h-20 mx-auto mb-4 text-purple-300" />
                      <h3 className="mb-2 text-gray-700">No Entries Yet</h3>
                      <p className="text-gray-600 mb-6">
                        Start journaling to track your thoughts and growth!
                      </p>
                      <Button
                        onClick={() => setActiveView('new')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Entry
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEntries.map((entry, index) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 hover:shadow-xl transition-all h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {entry.category}
                              </Badge>
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleFavorite(entry._id)}
                                  className={entry.isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                                >
                                  <Star className="w-5 h-5" fill={entry.isFavorite ? 'currentColor' : 'none'} />
                                </motion.button>
                              </div>
                            </div>
                            <CardTitle className="text-lg line-clamp-1">{entry.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 text-xs">
                              <Clock className="w-3 h-3" />
                              {new Date(entry.createdAt).toLocaleDateString()}
                              {entry.mood && <span className="ml-2 text-lg">{entry.mood}</span>}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                              {entry.content}
                            </p>
                            {entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {entry.tags.slice(0, 3).map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditEntry(entry)}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteJournalEntry(entry._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* New Entry View */}
            {activeView === 'new' && (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-6 h-6 text-purple-600" />
                      {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
                    </CardTitle>
                    <CardDescription>
                      Express yourself freely - your thoughts are safe here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Writing Prompt */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Writing Prompt</span>
                          </div>
                          <p className="text-purple-800 italic">{currentPrompt}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={getNewPrompt}
                          className="text-purple-600"
                        >
                          New Prompt
                        </Button>
                      </div>
                    </motion.div>

                    {/* Entry Type */}
                    <div>
                      <Label>Entry Type</Label>
                      <div className="flex gap-3 mt-2">
                        {[
                          { value: 'text', icon: FileText, label: 'Text' },
                          { value: 'voice', icon: Mic, label: 'Voice Note' },
                          { value: 'video', icon: Video, label: 'Video Note' }
                        ].map((type) => (
                          <motion.button
                            key={type.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNewEntry({ ...newEntry, type: type.value as any })}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                              newEntry.type === type.value
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <type.icon className="w-6 h-6 mx-auto mb-2" />
                            <span className="text-sm">{type.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Give your entry a title..."
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newEntry.category}
                        onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="goals">Goals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content */}
                    {newEntry.type === 'text' && (
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Start writing your thoughts..."
                          value={newEntry.content}
                          onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                          className="mt-2 min-h-64"
                        />
                      </div>
                    )}

                    {newEntry.type === 'voice' && (
                      <div>
                        <Label>Voice Note</Label>
                        <div className="mt-2 p-8 border-2 border-dashed border-purple-300 rounded-xl text-center">
                          <Mic className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                          <p className="text-gray-600 mb-4">Click to record your voice note</p>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                            <Mic className="w-4 h-4 mr-2" />
                            Start Recording
                          </Button>
                          <Textarea
                            placeholder="Or type your thoughts here..."
                            value={newEntry.content}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            className="mt-4"
                          />
                        </div>
                      </div>
                    )}

                    {newEntry.type === 'video' && (
                      <div>
                        <Label>Video Note</Label>
                        <div className="mt-2 p-8 border-2 border-dashed border-purple-300 rounded-xl text-center">
                          <Video className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                          <p className="text-gray-600 mb-4">Record a video journal entry</p>
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                            <Video className="w-4 h-4 mr-2" />
                            Start Recording
                          </Button>
                          <Textarea
                            placeholder="Or type your thoughts here..."
                            value={newEntry.content}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            className="mt-4"
                          />
                        </div>
                      </div>
                    )}

                    {/* Mood */}
                    <div>
                      <Label>How are you feeling?</Label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {moodEmojis.map((emoji) => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setNewEntry({ ...newEntry, mood: emoji })}
                            className={`text-3xl p-3 rounded-xl transition-all ${
                              newEntry.mood === emoji
                                ? 'bg-purple-100 ring-2 ring-purple-500'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., gratitude, reflection, goals"
                        value={newEntry.tags.join(', ')}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          })
                        }
                        className="mt-2"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={saveJournalEntry}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : (editingEntry ? 'Update Entry' : 'Save Entry')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveView('entries');
                          setEditingEntry(null);
                          setNewEntry({
                            title: '',
                            content: '',
                            type: 'text',
                            tags: [],
                            mood: '',
                            category: 'personal',
                            voiceNote: '',
                            videoNote: ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* To-Do Lists View */}
            {activeView === 'todos' && (
              <motion.div
                key="todos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* Add Todo */}
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-6 h-6 text-purple-600" />
                      To-Do Lists
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="Add a new task..."
                        value={newTodo.text}
                        onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                        className="flex-1"
                      />
                      <div className="flex gap-3">
                        <Select
                          value={newTodo.category}
                          onValueChange={(value: any) => setNewTodo({ ...newTodo, category: value })}
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="study">Study</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={newTodo.priority}
                          onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}
                        >
                          <SelectTrigger className="w-full sm:w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={addTodo}
                          disabled={loading}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Todo List */}
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {todos.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No tasks yet. Add one to get started!</p>
                          </div>
                        ) : (
                          todos.map((todo, index) => (
                            <motion.div
                              key={todo._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                todo.completed
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={todo.completed}
                                  onCheckedChange={() => toggleTodo(todo._id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <p
                                    className={`${
                                      todo.completed
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-800'
                                    }`}
                                  >
                                    {todo.text}
                                  </p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {todo.category}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        todo.priority === 'high'
                                          ? 'border-red-300 text-red-600'
                                          : todo.priority === 'medium'
                                          ? 'border-yellow-300 text-yellow-600'
                                          : 'border-gray-300 text-gray-600'
                                      }`}
                                    >
                                      {todo.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTodo(todo._id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {/* Stats */}
                    {todos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {todos.length}
                          </p>
                          <p className="text-sm text-gray-600">Total Tasks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-green-600">
                            {todos.filter(t => t.completed).length}
                          </p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-orange-600">
                            {todos.filter(t => !t.completed).length}
                          </p>
                          <p className="text-sm text-gray-600">Remaining</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Study Planner View */}
            {activeView === 'study' && (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                      Study Planner
                    </CardTitle>
                    <CardDescription>
                      Plan and track your study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Study Session */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Subject</Label>
                        <Input
                          placeholder="e.g., Math, Science"
                          value={newStudySession.subject}
                          onChange={(e) =>
                            setNewStudySession({ ...newStudySession, subject: e.target.value })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Topic</Label>
                        <Input
                          placeholder="e.g., Algebra, Biology"
                          value={newStudySession.topic}
                          onChange={(e) =>
                            setNewStudySession({ ...newStudySession, topic: e.target.value })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          placeholder="30"
                          value={newStudySession.duration}
                          onChange={(e) =>
                            setNewStudySession({
                              ...newStudySession,
                              duration: parseInt(e.target.value) || 0
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={addStudySession}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Session
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Study notes, topics to review..."
                        value={newStudySession.notes}
                        onChange={(e) =>
                          setNewStudySession({ ...newStudySession, notes: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>

                    {/* Study Sessions List */}
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {studySessions.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>No study sessions planned yet!</p>
                          </div>
                        ) : (
                          studySessions.map((session, index) => (
                            <motion.div
                              key={session._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 rounded-xl border-2 ${
                                session.completed
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-purple-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={session.completed}
                                  onCheckedChange={() => toggleStudySession(session._id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <h4
                                    className={`mb-1 ${
                                      session.completed
                                        ? 'line-through text-gray-500'
                                        : 'text-gray-800'
                                    }`}
                                  >
                                    {session.subject} - {session.topic}
                                  </h4>
                                  <div className="flex gap-3 text-sm text-gray-600 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {session.duration} min
                                    </span>
                                    <span>
                                      {new Date(session.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {session.notes && (
                                    <p className="text-sm text-gray-600">{session.notes}</p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteStudySession(session._id)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {/* Study Stats */}
                    {studySessions.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {studySessions.reduce((acc, s) => acc + s.duration, 0)}
                          </p>
                          <p className="text-sm text-gray-600">Total Minutes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-green-600">
                            {studySessions.filter(s => s.completed).length}
                          </p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-orange-600">
                            {studySessions.filter(s => !s.completed).length}
                          </p>
                          <p className="text-sm text-gray-600">Pending</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Calendar View */}
            {activeView === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-6 h-6 text-purple-600" />
                      Calendar View
                    </CardTitle>
                    <CardDescription>
                      Track your entries, tasks, and study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-xl border shadow-sm"
                      />
                    </div>

                    {selectedDate && (
                      <div className="space-y-4">
                        <h3 className="text-gray-700">
                          Activities on {selectedDate.toLocaleDateString()}
                        </h3>

                        {/* Entries on selected date */}
                        <div>
                          <h4 className="text-sm text-gray-600 mb-2">Journal Entries</h4>
                          {journalEntries.filter(
                            e =>
                              new Date(e.createdAt).toDateString() === selectedDate.toDateString()
                          ).length === 0 ? (
                            <p className="text-sm text-gray-500">No entries on this day</p>
                          ) : (
                            <div className="space-y-2">
                              {journalEntries
                                .filter(
                                  e =>
                                    new Date(e.createdAt).toDateString() ===
                                    selectedDate.toDateString()
                                )
                                .map(entry => (
                                  <div
                                    key={entry._id}
                                    className="p-3 bg-purple-50 rounded-lg text-sm"
                                  >
                                    <p className="text-purple-900">{entry.title}</p>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Todos on selected date */}
                        <div>
                          <h4 className="text-sm text-gray-600 mb-2">Tasks</h4>
                          {todos.filter(
                            t => new Date(t.createdAt).toDateString() === selectedDate.toDateString()
                          ).length === 0 ? (
                            <p className="text-sm text-gray-500">No tasks on this day</p>
                          ) : (
                            <div className="space-y-2">
                              {todos
                                .filter(
                                  t =>
                                    new Date(t.createdAt).toDateString() ===
                                    selectedDate.toDateString()
                                )
                                .map(todo => (
                                  <div
                                    key={todo._id}
                                    className={`p-3 rounded-lg text-sm ${
                                      todo.completed ? 'bg-green-50' : 'bg-orange-50'
                                    }`}
                                  >
                                    <p
                                      className={
                                        todo.completed
                                          ? 'text-green-900 line-through'
                                          : 'text-orange-900'
                                      }
                                    >
                                      {todo.text}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Study sessions on selected date */}
                        <div>
                          <h4 className="text-sm text-gray-600 mb-2">Study Sessions</h4>
                          {studySessions.filter(
                            s => new Date(s.createdAt).toDateString() === selectedDate.toDateString()
                          ).length === 0 ? (
                            <p className="text-sm text-gray-500">No study sessions on this day</p>
                          ) : (
                            <div className="space-y-2">
                              {studySessions
                                .filter(
                                  s =>
                                    new Date(s.createdAt).toDateString() ===
                                    selectedDate.toDateString()
                                )
                                .map(session => (
                                  <div
                                    key={session._id}
                                    className="p-3 bg-blue-50 rounded-lg text-sm"
                                  >
                                    <p className="text-blue-900">
                                      {session.subject} - {session.topic} ({session.duration} min)
                                    </p>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition3D>
  );
}
