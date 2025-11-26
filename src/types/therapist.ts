export interface Therapist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  experience: number; // years
  costPerSession: number;
  availability: 'Available' | 'Busy' | 'Offline';
  languages: string[];
  bio: string;
  education: string[];
  approach: string;
  avatar: string;
  nextAvailable?: string;
}

export interface Session {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistAvatar?: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'video' | 'chat' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
  cost: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentDate?: string;
}

export interface ProgressEntry {
  id: string;
  date: string;
  mood: number; // 1-10
  notes: string;
  therapistNotes?: string;
  goals: string[];
  achievements: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}