import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Therapist from '../models/Therapist.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: resolve(__dirname, '../.env') });

const addRoleToTherapists = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined in environment variables');
      console.log('Please make sure you have a .env file in the /server directory with MONGO_URI defined');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for migration');

    // Update all therapist records that don't have a role field
    const result = await Therapist.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'therapist' } }
    );

    console.log(`✅ Migration complete: Updated ${result.modifiedCount} therapist records`);
    
    // Also check if there are any therapists with null or empty role
    const resultNull = await Therapist.updateMany(
      { $or: [{ role: null }, { role: '' }] },
      { $set: { role: 'therapist' } }
    );
    
    console.log(`✅ Fixed ${resultNull.modifiedCount} therapists with null/empty role`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

addRoleToTherapists();