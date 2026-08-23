const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// PUT update role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found in database" });
        }

        
        if (userToUpdate._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot change your own admin role!" });
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        res.json({ message: "Role updated successfully", user: userToUpdate });
    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};