import mongoose from 'mongoose';
import TherapistAuth from './models/TherapistAuth.js';
import dotenv from 'dotenv';

dotenv.config();

async function setSlotsForToday() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Setting slots for:', today);

    // Find all therapists
    const therapists = await TherapistAuth.find({});
    console.log(`👨‍⚕️ Found ${therapists.length} therapists`);

    // Generate slots from current time onwards
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Round up to next 30-minute slot
    let startHour = currentHour;
    let startMinute = currentMinute < 30 ? 30 : 0;
    if (startMinute === 0) {
      startHour += 1;
    }

    // Generate slots from start time to 22:00 (10 PM)
    const slots = [];
    for (let hour = startHour; hour < 22; hour++) {
      for (let minute of [0, 30]) {
        if (hour === startHour && minute < startMinute) continue;
        
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute === 0 ? 30 : 0;
        const endHour = minute === 30 ? hour + 1 : hour;
        const end = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        slots.push({
          startTime: start,
          endTime: end,
          isBooked: false
        });
      }
    }

    console.log(`⏰ Generated ${slots.length} available slots`);
    console.log('First slot:', slots[0]);
    console.log('Last slot:', slots[slots.length - 1]);

    // Update all therapists with today's slots
    for (const therapist of therapists) {
      // Remove old slot entries for today
      therapist.timeSlots = therapist.timeSlots.filter(
        slot => slot.date !== today
      );

      // Add new slots for today
      therapist.timeSlots.push({
        date: today,
        slots: slots
      });

      await therapist.save();
      console.log(`✅ Updated slots for ${therapist.name} (${therapist.email})`);
    }

    console.log('\n🎉 All therapists updated with today\'s available slots!');
    console.log(`\n📋 You can now book sessions starting from ${slots[0].startTime}`);
    
  } catch (error) {
    console.error('❌ Error setting slots:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

setSlotsForToday();