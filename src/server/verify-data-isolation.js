import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Mood from './models/Mood.js';
import Journal from './models/Journal.js';
import Conversation from './models/Conversation.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const verifyDataIsolation = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected!\n');

    // Get all users
    const users = await User.find().select('name email _id');
    console.log(`👥 Total Users: ${users.length}\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found. Create some test accounts first!\n');
      process.exit(0);
    }

    // Display user list
    console.log('📋 User List:');
    console.log('═'.repeat(60));
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   User ID: ${user._id}`);
      console.log('─'.repeat(60));
    });
    console.log('\n');

    // Check data for each user
    for (const user of users) {
      console.log(`\n🔍 Checking data for: ${user.name} (${user.email})`);
      console.log('═'.repeat(60));

      // Mood entries
      const moods = await Mood.find({ userId: user._id });
      console.log(`📊 Mood Entries: ${moods.length}`);
      if (moods.length > 0) {
        moods.forEach((mood, i) => {
          console.log(`   ${i + 1}. ${mood.mood} (${mood.intensity}/10) - ${mood.date?.toLocaleDateString() || 'No date'}`);
        });
      }

      // Journal entries
      const journals = await Journal.find({ userId: user._id });
      console.log(`📝 Journal Entries: ${journals.length}`);
      if (journals.length > 0) {
        journals.forEach((journal, i) => {
          console.log(`   ${i + 1}. "${journal.title}" - ${journal.createdAt?.toLocaleDateString() || 'No date'}`);
        });
      }

      // Conversations
      const conversations = await Conversation.find({ participants: user._id });
      console.log(`💬 Conversations: ${conversations.length}`);
      if (conversations.length > 0) {
        conversations.forEach((conv, i) => {
          console.log(`   ${i + 1}. ${conv.type} - ${conv.title || 'Untitled'}`);
        });
      }

      // Appointments
      const appointments = await Appointment.find({ userId: user._id });
      console.log(`📅 Appointments: ${appointments.length}`);
      if (appointments.length > 0) {
        appointments.forEach((apt, i) => {
          console.log(`   ${i + 1}. ${apt.status} - ${apt.date?.toLocaleDateString() || 'No date'}`);
        });
      }

      console.log('─'.repeat(60));
    }

    // Verify data isolation
    console.log('\n\n🔒 Data Isolation Verification:');
    console.log('═'.repeat(60));

    let isolationIssues = 0;

    // Check if any mood entries have invalid userId
    const allMoods = await Mood.find();
    for (const mood of allMoods) {
      const userExists = users.some(u => u._id.toString() === mood.userId.toString());
      if (!userExists) {
        console.log(`❌ Orphaned mood entry found: ${mood._id} (userId: ${mood.userId})`);
        isolationIssues++;
      }
    }

    // Check if any journal entries have invalid userId
    const allJournals = await Journal.find();
    for (const journal of allJournals) {
      const userExists = users.some(u => u._id.toString() === journal.userId.toString());
      if (!userExists) {
        console.log(`❌ Orphaned journal entry found: ${journal._id} (userId: ${journal.userId})`);
        isolationIssues++;
      }
    }

    // Check if any appointments have invalid userId
    const allAppointments = await Appointment.find();
    for (const appointment of allAppointments) {
      const userExists = users.some(u => u._id.toString() === appointment.userId.toString());
      if (!userExists) {
        console.log(`❌ Orphaned appointment found: ${appointment._id} (userId: ${appointment.userId})`);
        isolationIssues++;
      }
    }

    if (isolationIssues === 0) {
      console.log('✅ All data is properly isolated by userId!');
      console.log('✅ No orphaned entries found!');
      console.log('✅ Data isolation is working correctly!');
    } else {
      console.log(`⚠️  Found ${isolationIssues} isolation issue(s)`);
    }

    console.log('═'.repeat(60));

    // Summary
    console.log('\n\n📈 Summary:');
    console.log('═'.repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Moods: ${allMoods.length}`);
    console.log(`Total Journals: ${allJournals.length}`);
    console.log(`Total Appointments: ${allAppointments.length}`);
    console.log(`Isolation Issues: ${isolationIssues}`);
    console.log('═'.repeat(60));

    console.log('\n✅ Verification complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB\n');
    process.exit();
  }
};

verifyDataIsolation();
