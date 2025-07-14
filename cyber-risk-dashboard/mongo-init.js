// MongoDB initialization script for cyber-risk-dashboard
db = db.getSiblingDB('cyber-risk-dashboard');

// Create collections
db.createCollection('users');
db.createCollection('organizations');
db.createCollection('projects');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.organizations.createIndex({ "name": 1 });
db.projects.createIndex({ "userId": 1 });
db.projects.createIndex({ "organizationId": 1 });
db.projects.createIndex({ "createdAt": -1 });

// Create admin user (optional - remove in production)
db.users.insertOne({
  username: "admin",
  email: "admin@cyberrisk.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYRNPL8z.BN4kii", // password: admin123
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log('Database initialized successfully'); 