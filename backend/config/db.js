const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        if (error.message.includes('authentication failed')) {
            console.error('ERROR: MongoDB Authentication Failed! Check your username and password in .env');
        } else {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
};

module.exports = connectDB;