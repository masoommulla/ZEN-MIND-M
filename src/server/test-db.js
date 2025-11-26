import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const testDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    if (collections.length === 0) {
      console.log('  (No collections yet - they will be created when first document is inserted)');
    } else {
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`\n👥 Total users: ${userCount}`);
    
    if (userCount > 0) {
      console.log('\n📝 Recent users:');
      const recentUsers = await User.find()
        .select('name email age createdAt')
        .sort({ createdAt: -1 })
        .limit(5);
      
      recentUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt.toLocaleDateString()}`);
      });
    }
    
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Check your MONGODB_URI in .env file');
    console.error('2. Verify your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('3. Ensure database user has correct permissions');
    console.error('4. Check if MongoDB Atlas cluster is running');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

testDatabase();
