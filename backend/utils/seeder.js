const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
    try {
        // 1. Connect to Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // 2. Check if an admin already exists
        const adminExists = await User.findOne({ role: 'ADMIN' });
        if (adminExists) {
            console.log("Admin already exists. No action taken.");
            process.exit();
        }

        // 3. Create Admin Data
        const adminData = {
            name: "Main Admin",
            email: "admin@dmart.com",
            password: "adminpassword123", 
            role: "ADMIN"
        };

        // 4. Save to Database
        await User.create(adminData);
        console.log("Admin User Created Successfully!");
        console.log("Email: admin@dmart.com");
        console.log("Password: adminpassword123");

        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();