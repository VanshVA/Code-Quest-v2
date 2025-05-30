const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

// Create a default admin if none exists
const createDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminCount = await Admin.countDocuments({});
    
    // If no admin exists, create one
    if (adminCount === 0) {
      const defaultAdmin = {
        adminName: 'Admin',
        adminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@codequest.edu',
        adminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
        role: 'admin'
      };
      
      const admin = new Admin(defaultAdmin);
      await admin.save();
      
      console.log('Default admin created successfully:', defaultAdmin.adminEmail);
    } else {
      console.log('Admin already exists. Skipping default admin creation.');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = createDefaultAdmin;