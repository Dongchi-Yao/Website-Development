import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Project from '../models/Project.js';

dotenv.config();

async function verifyMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check for organization
    const organization = await Organization.findOne({ code: 'DEMO01' });
    if (!organization) {
      console.log('❌ Organization not found!');
      return;
    }
    console.log('✅ Organization found:', organization.name, 'Code:', organization.code);

    // Check for users
    const users = await User.find({ 
      email: { $in: ['manager@construction.com', 'user1@construction.com', 'user2@construction.com'] } 
    }).select('name email role isEmailVerified organization');

    console.log('\n📋 Users found:');
    for (const user of users) {
      console.log(`- ${user.name} (${user.email})`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Email Verified: ${user.isEmailVerified}`);
      console.log(`  Organization: ${user.organization ? 'Yes' : 'No'}`);
      
      // Count projects for each user
      const projectCount = await Project.countDocuments({ userId: user._id });
      console.log(`  Projects: ${projectCount}`);
    }

    if (users.length !== 3) {
      console.log(`\n⚠️  Expected 3 users but found ${users.length}`);
    }

    // Test login capability
    console.log('\n🔐 Testing login capability:');
    const testUser = await User.findOne({ email: 'manager@construction.com' });
    if (testUser) {
      const isMatch = await testUser.comparePassword('Demo123!');
      console.log(`Password test for manager@construction.com: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
    }

    // Show total counts
    const totalProjects = await Project.countDocuments({ organization: organization._id });
    console.log(`\n📊 Total projects in organization: ${totalProjects}`);

  } catch (error) {
    console.error('Error verifying mock data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
verifyMockData(); 
import dotenv from 'dotenv';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Project from '../models/Project.js';

dotenv.config();

async function verifyMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check for organization
    const organization = await Organization.findOne({ code: 'DEMO01' });
    if (!organization) {
      console.log('❌ Organization not found!');
      return;
    }
    console.log('✅ Organization found:', organization.name, 'Code:', organization.code);

    // Check for users
    const users = await User.find({ 
      email: { $in: ['manager@construction.com', 'user1@construction.com', 'user2@construction.com'] } 
    }).select('name email role isEmailVerified organization');

    console.log('\n📋 Users found:');
    for (const user of users) {
      console.log(`- ${user.name} (${user.email})`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Email Verified: ${user.isEmailVerified}`);
      console.log(`  Organization: ${user.organization ? 'Yes' : 'No'}`);
      
      // Count projects for each user
      const projectCount = await Project.countDocuments({ userId: user._id });
      console.log(`  Projects: ${projectCount}`);
    }

    if (users.length !== 3) {
      console.log(`\n⚠️  Expected 3 users but found ${users.length}`);
    }

    // Test login capability
    console.log('\n🔐 Testing login capability:');
    const testUser = await User.findOne({ email: 'manager@construction.com' });
    if (testUser) {
      const isMatch = await testUser.comparePassword('Demo123!');
      console.log(`Password test for manager@construction.com: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
    }

    // Show total counts
    const totalProjects = await Project.countDocuments({ organization: organization._id });
    console.log(`\n📊 Total projects in organization: ${totalProjects}`);

  } catch (error) {
    console.error('Error verifying mock data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
verifyMockData(); 