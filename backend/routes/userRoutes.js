const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const {protect}= require('../middlewares/authMiddleware')


// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        // res.status(201).json({ message: 'User registered successfully' });
        //Create JWT Payload
        const payload = {
            user: {
                id: newUser.id,
                role: newUser.role
            }
        };
        //Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '40h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    user:{
                        _id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role
                    },token
                })
            }
        );

    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        //Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '40h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    user:{
                        _id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },token
                })
            }
        );

    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
);

// Update user details
//@desc get logged in user's profile (Protected route)
// @route GET /api/users/profile
// @access Private
router.get('/profile', protect, async(req, res)=>{
    res.json(req.user);
})








module.exports = router;