import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Therapist from '../models/Therapist.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const therapistsData = [
  {
    name: 'Dr. Priya Sharma',
    email: 'therapist1@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    about: 'Specialized in helping teenagers cope with anxiety and depression. 10+ years of experience in adolescent psychology.',
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    education: 'PhD in Clinical Psychology, NIMHANS Bangalore',
    experience: 10,
    languages: ['English', 'Hindi', 'Gujarati'],
    pricePerSession: 700,
    sessionDuration: 60
  },
  {
    name: 'Dr. Rahul Verma',
    email: 'therapist2@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    about: 'Compassionate therapist focusing on teen mental health, self-esteem, and emotional regulation.',
    specializations: ['Self-Esteem', 'Social Anxiety', 'Teen Counseling'],
    education: 'M.Phil in Psychology, Delhi University',
    experience: 8,
    languages: ['English', 'Hindi', 'Bengali'],
    pricePerSession: 600,
    sessionDuration: 60
  },
  {
    name: 'Dr. Anjali Desai',
    email: 'therapist3@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    about: 'Expert in trauma therapy and helping teens navigate difficult emotions and life transitions.',
    specializations: ['Trauma', 'Grief', 'Family Issues'],
    education: 'M.A. in Clinical Psychology, Mumbai University',
    experience: 12,
    languages: ['English', 'Hindi', 'Marathi'],
    pricePerSession: 1000,
    sessionDuration: 60
  },
  {
    name: 'Dr. Arjun Mehta',
    email: 'therapist4@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    about: 'Dedicated to helping teens with academic pressure, peer relationships, and identity issues.',
    specializations: ['Academic Stress', 'Peer Pressure', 'Identity Issues'],
    education: 'M.Sc. in Counseling Psychology, Christ University',
    experience: 6,
    languages: ['English', 'Hindi', 'Kannada'],
    pricePerSession: 500,
    sessionDuration: 60
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'therapist5@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
    about: 'Experienced in mindfulness-based therapy for teens dealing with stress and emotional challenges.',
    specializations: ['Mindfulness', 'Emotional Regulation', 'Stress Management'],
    education: 'M.A. in Psychology, Pune University',
    experience: 9,
    languages: ['English', 'Hindi', 'Tamil'],
    pricePerSession: 650,
    sessionDuration: 60
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'therapist6@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1613980560755-3ee2f19b58e0?w=400',
    about: 'Specialist in adolescent behavioral issues and helping teens develop healthy coping mechanisms.',
    specializations: ['Behavioral Issues', 'Anger Management', 'ADHD'],
    education: 'M.Phil in Psychology, Jadavpur University',
    experience: 14,
    languages: ['English', 'Hindi', 'Punjabi'],
    pricePerSession: 900,
    sessionDuration: 60
  },
  {
    name: 'Dr. Meera Reddy',
    email: 'therapist7@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    about: 'Helping teenagers overcome depression and build resilience through cognitive behavioral therapy.',
    specializations: ['Depression', 'CBT', 'Resilience Building'],
    education: 'PhD in Psychology, Hyderabad University',
    experience: 11,
    languages: ['English', 'Hindi', 'Telugu'],
    pricePerSession: 800,
    sessionDuration: 60
  },
  {
    name: 'Dr. Karan Patel',
    email: 'therapist8@gmail.com',
    password: 'TestZenmind@123',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    about: 'Specializing in teen relationship issues, communication skills, and conflict resolution.',
    specializations: ['Relationship Issues', 'Communication', 'Conflict Resolution'],
    education: 'M.A. in Counseling Psychology, Ahmedabad University',
    experience: 7,
    languages: ['English', 'Hindi', 'Gujarati'],
    pricePerSession: 550,
    sessionDuration: 60
  }
];

const seedTherapists = async () => {
  try {
    console.log('🌱 Starting therapist seeding...');

    // Clear existing therapists
    await Therapist.deleteMany({});
    console.log('✅ Cleared existing therapists');

    // Get today and tomorrow dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    // Default 3 slots for all therapists
    const defaultSlots = [
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '12:00', endTime: '13:00' },
      { startTime: '14:00', endTime: '15:00' }
    ];

    // Create therapists with default slots
    const therapists = await Promise.all(
      therapistsData.map(async (data) => {
        const therapist = await Therapist.create({
          ...data,
          availableSlots: [
            {
              date: formatDate(today),
              slots: defaultSlots.map(slot => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: false,
                bookedBy: null,
                appointmentId: null
              }))
            },
            {
              date: formatDate(tomorrow),
              slots: defaultSlots.map(slot => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: false,
                bookedBy: null,
                appointmentId: null
              }))
            }
          ]
        });

        console.log(`✅ Created: ${therapist.name} (${therapist.email})`);
        console.log(`   Slots: 10:00-11:00, 12:00-13:00, 14:00-15:00`);
        return therapist;
      })
    );

    console.log(`\n✅ Successfully seeded ${therapists.length} therapists!`);
    console.log('\n📋 Therapist Login Credentials:');
    console.log('─'.repeat(50));
    therapists.forEach((t, i) => {
      console.log(`${i + 1}. Email: ${t.email}`);
      console.log(`   Password: TestZenmind@123`);
      console.log(`   Price: ₹${t.pricePerSession}/session`);
    });
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding therapists:', error);
    process.exit(1);
  }
};

seedTherapists();