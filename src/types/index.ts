export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10
  emotions: string[];
  activities: string[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: number;
  tags: string[];
  isPrivate: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  credentials: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  experience: string;
  nextAvailable: string;
  sessionTypes: string[];
  price: string;
  languages: string[];
  matchScore?: number;
  bio: string;
  approach: string[];
  education: string;
}

export interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistPhoto: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'exercise' | 'video' | 'worksheet' | 'audio';
  category: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  ratingCount: number;
  thumbnail: string;
  content?: string;
}

export type ViewType = 'landing' | 'dashboard' | 'chat' | 'mood' | 'journal' | 'therapists' | 'appointments' | 'resources' | 'settings';
