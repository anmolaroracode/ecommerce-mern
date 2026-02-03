const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');

//@route POST /api/admin/orders
//@desc Get all orders (admin only)
//@access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'username email');
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);

//@route PUT /api/admin/orders/:id
//@desc Update order status by ID (admin only)
//@access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Find order by ID and update status
      const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }
        order.status = status || order.status;
        order.isDelivered = status === 'Delivered' ? true : order.isDelivered;
        order.deliveredAt = status === 'Delivered' ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();
        res.json({ message: "Order status updated successfully", order: updatedOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);

//@route DELETE /api/admin/orders/:id
//@desc Delete order by ID (admin only)
//@access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find order by ID and delete
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        res.json({ message: "Order removed successfully" , order: deletedOrder});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}
);

module.exports = router;


