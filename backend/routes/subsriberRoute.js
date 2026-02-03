const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscribe');

//@route POST /api/subscribe
//@desc Add a new subscriber
//@access Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({
            email: email.toLowerCase().trim()
        });
        if (existingSubscriber) {
            return res.status(400).json({ message: "Subscriber already exists" });
        }

        // Create new subscriber
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: "Subscriber added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);

module.exports = router;
