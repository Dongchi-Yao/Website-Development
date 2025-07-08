import mongoose from 'mongoose';
import crypto from 'crypto';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    default: function() {
      // Generate a unique 6-character code
      return crypto.randomBytes(3).toString('hex').toUpperCase();
    }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  industry: {
    type: String,
    enum: ['Construction', 'Engineering', 'Architecture', 'Real Estate', 'Other'],
    default: 'Other'
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Enterprise'],
    default: 'Small'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
organizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure manager is included in members array
organizationSchema.pre('save', function(next) {
  if (!this.members.includes(this.manager)) {
    this.members.push(this.manager);
  }
  next();
});

// Virtual for member count
organizationSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add a member
organizationSchema.methods.addMember = async function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    await this.save();
  }
  return this;
};

// Method to remove a member
organizationSchema.methods.removeMember = async function(userId) {
  this.members = this.members.filter(id => !id.equals(userId));
  await this.save();
  return this;
};

// Method to check if user is manager
organizationSchema.methods.isManager = function(userId) {
  return this.manager.equals(userId);
};

// Static method to generate unique code
organizationSchema.statics.generateUniqueCode = async function() {
  let code;
  let exists = true;
  
  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    exists = await this.findOne({ code });
  }
  
  return code;
};

// Ensure JSON output includes virtuals
organizationSchema.set('toJSON', {
  virtuals: true
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization; 
import crypto from 'crypto';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    default: function() {
      // Generate a unique 6-character code
      return crypto.randomBytes(3).toString('hex').toUpperCase();
    }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  industry: {
    type: String,
    enum: ['Construction', 'Engineering', 'Architecture', 'Real Estate', 'Other'],
    default: 'Other'
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Enterprise'],
    default: 'Small'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
organizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure manager is included in members array
organizationSchema.pre('save', function(next) {
  if (!this.members.includes(this.manager)) {
    this.members.push(this.manager);
  }
  next();
});

// Virtual for member count
organizationSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Method to add a member
organizationSchema.methods.addMember = async function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    await this.save();
  }
  return this;
};

// Method to remove a member
organizationSchema.methods.removeMember = async function(userId) {
  this.members = this.members.filter(id => !id.equals(userId));
  await this.save();
  return this;
};

// Method to check if user is manager
organizationSchema.methods.isManager = function(userId) {
  return this.manager.equals(userId);
};

// Static method to generate unique code
organizationSchema.statics.generateUniqueCode = async function() {
  let code;
  let exists = true;
  
  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    exists = await this.findOne({ code });
  }
  
  return code;
};

// Ensure JSON output includes virtuals
organizationSchema.set('toJSON', {
  virtuals: true
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization; 