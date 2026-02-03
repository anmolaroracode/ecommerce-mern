const express = require('express');
const router = express.Router();

const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { protect } = require('../middlewares/authMiddleware');

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/razorpay/order", protect, async (req, res) => {
  const { amount } = req.body; // in rupees

  if (!amount) {
    return res.status(400).json({ message: "Amount missing" });
  }

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: "rcpt_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log("RAZORPAY ERROR", error);
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

// ===============================
// @route   POST /api/checkout
// @desc    Create a new checkout session
// @access  Private
// ===============================
router.post('/', protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: 'No checkout items provided' });
  }

  try {
    const checkout = new Checkout({
      user: req.user._id,
      items: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      isPaid: false,
    });

    await checkout.save(); // ✅ Save to DB
    console.log('✅ Checkout created for user:', req.user._id);

    return res.status(201).json(checkout);
  } catch (error) {
    console.error('❌ Error creating checkout:', error);
    return res.status(500).json({ message: 'Server error creating checkout' });
  }
});

// ===============================
// @route   PUT /api/checkout/:id/pay
// @desc    Update checkout to paid
// @access  Private
// ===============================
router.put('/:id/pay', protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout Not Found' });
    }

    if (paymentStatus?.toLowerCase() === 'paid') {
      if (checkout.isPaid) {
        return res.status(400).json({ message: 'Checkout already marked as paid' });
      }

      checkout.isPaid = true;
      checkout.paymentStatus = 'paid';
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();

      await checkout.save();
      console.log('💰 Checkout marked as paid for user:', checkout.user);

      return res.status(200).json(checkout);
    } else {
      return res.status(400).json({ message: 'Invalid Payment Status' });
    }
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    return res.status(500).json({ message: 'Server error updating payment status' });
  }
});

// ===============================
// @route   POST /api/checkout/:id/finalize
// @desc    Finalize order after successful payment
// @access  Private
// ===============================
router.post('/:id/finalize', protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout Not Found' });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: 'Payment Not Completed' });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: 'Checkout is already finalized' });
    }

    // ✅ Create new order
    const finalOrder = new Order({
      user: checkout.user,
      items: checkout.items,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: 'paid',
      paymentDetails: checkout.paymentDetails,
    });

    // Save order first (safest)
    await finalOrder.save();

    // ✅ Mark checkout as finalized
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    // ✅ Delete user cart (after order saved)
    await Cart.findOneAndDelete({ user: checkout.user });

    console.log('📦 Final order created for user:', checkout.user);

    // Optionally populate user info for frontend
    const populatedOrder = await finalOrder.populate('user', 'name email');

    return res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('❌ Error finalizing checkout:', error);
    return res.status(500).json({ message: 'Server error finalizing checkout' });
  }
});

module.exports = router;
