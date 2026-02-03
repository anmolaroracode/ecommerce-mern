const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const User = require('../models/Users');

// =======================
// GET ALL USERS (ADMIN)
// =======================
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// =======================
// CREATE USER (ADMIN)
// =======================
router.post('/users/add', protect, admin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// =======================
// UPDATE USER (ADMIN)
// =======================
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const { username, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// =======================
// DELETE USER
// =======================
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
