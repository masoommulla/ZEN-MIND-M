import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TherapistAuth from '../models/TherapistAuth.js';

dotenv.config();

// Therapist data with original email pattern and password
const therapistsData = [
  {
    name: 'Dr. Priya Sharma',
    email: 'therapist1@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    about: 'Specialized in helping teenagers cope with anxiety and depression. 10+ years of experience in adolescent psychology.',
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    education: 'PhD in Clinical Psychology, NIMHANS Bangalore',
    experience: 10,
    languages: ['English', 'Hindi', 'Gujarati'],
    pricing: {
      perSession: 700,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Rahul Verma',
    email: 'therapist2@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    about: 'Compassionate therapist focusing on teen mental health, self-esteem, and emotional regulation.',
    specializations: ['Self Esteem', 'Teen Counseling', 'Relationship Issues'],
    education: 'M.Phil in Psychology, Delhi University',
    experience: 8,
    languages: ['English', 'Hindi', 'Bengali'],
    pricing: {
      perSession: 600,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Anjali Desai',
    email: 'therapist3@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    about: 'Expert in trauma therapy and helping teens navigate difficult emotions and life transitions.',
    specializations: ['Trauma', 'Grief', 'Family Issues'],
    education: 'M.A. in Clinical Psychology, Mumbai University',
    experience: 12,
    languages: ['English', 'Hindi', 'Marathi'],
    pricing: {
      perSession: 1000,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Arjun Mehta',
    email: 'therapist4@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    about: 'Dedicated to helping teens with academic pressure, peer relationships, and identity issues.',
    specializations: ['Academic Pressure', 'Stress Management', 'Anxiety'],
    education: 'M.Sc. in Counseling Psychology, Christ University',
    experience: 6,
    languages: ['English', 'Hindi', 'Kannada'],
    pricing: {
      perSession: 500,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'therapist5@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    about: 'Experienced in mindfulness-based therapy for teens dealing with stress and emotional challenges.',
    specializations: ['Stress Management', 'Anxiety', 'Depression'],
    education: 'M.A. in Psychology, Pune University',
    experience: 9,
    languages: ['English', 'Hindi', 'Tamil'],
    pricing: {
      perSession: 650,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'therapist6@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1613980560755-3ee2f19b58e0?w=400',
    about: 'Specialist in adolescent behavioral issues and helping teens develop healthy coping mechanisms.',
    specializations: ['Teen Counseling', 'Self Esteem', 'Relationship Issues'],
    education: 'M.Phil in Psychology, Jadavpur University',
    experience: 14,
    languages: ['English', 'Hindi', 'Punjabi'],
    pricing: {
      perSession: 900,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'therapist7@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    about: 'Helping teenagers overcome depression and build resilience through cognitive behavioral therapy.',
    specializations: ['Depression', 'Anxiety', 'Stress Management'],
    education: 'PhD in Psychology, Hyderabad University',
    experience: 11,
    languages: ['English', 'Hindi', 'Telugu'],
    pricing: {
      perSession: 800,
      duration: 30,
      currency: 'INR'
    }
  },
  {
    name: 'Dr. Karan Patel',
    email: 'therapist8@gmail.com',
    password: 'Test@1234',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    about: 'Specializing in teen relationship issues, communication skills, and conflict resolution.',
    specializations: ['Relationship Issues', 'Teen Counseling', 'Family Issues'],
    education: 'M.A. in Counseling Psychology, Ahmedabad University',
    experience: 7,
    languages: ['English', 'Hindi', 'Gujarati'],
    pricing: {
      perSession: 550,
      duration: 30,
      currency: 'INR'
    }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Generate time slots for today and tomorrow
const generateTimeSlots = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  // Default 3 slots per day
  const defaultSlots = [
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '12:00', endTime: '13:00' },
    { startTime: '14:00', endTime: '15:00' }
  ];

  return [
    {
      date: formatDate(today),
      slots: defaultSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        appointmentId: null
      }))
    },
    {
      date: formatDate(tomorrow),
      slots: defaultSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
        appointmentId: null
      }))
    }
  ];
};

// Seed therapists
const seedTherapists = async () => {
  try {
    console.log('🌱 Starting therapist seeding...');

    // Check if therapists already exist
    const count = await TherapistAuth.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Found ${count} existing therapists. Skipping seed.`);
      return;
    }

    // Create therapists with time slots
    const therapists = await Promise.all(
      therapistsData.map(async (data) => {
        const timeSlots = generateTimeSlots();
        const therapist = await TherapistAuth.create({
          ...data,
          timeSlots
        });
        console.log(`✅ Created: ${therapist.name} (${therapist.email})`);
        return therapist;
      })
    );

    console.log(`\n✅ Successfully seeded ${therapists.length} therapists!`);
    console.log('📋 All therapists use password: Test@1234');
  } catch (error) {
    console.error('❌ Error seeding therapists:', error);
  }
};

export default seedTherapists;