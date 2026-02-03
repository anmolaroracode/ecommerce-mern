const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const dbConnect = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/ProductRoutes');
const cartRoutes = require('./routes/cartRoute');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoute = require('./routes/uploadRoute');
const subscribeRoute = require('./routes/subsriberRoute');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

dotenv.config(); // Load environment variables from .env file

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 3000; // Use PORT from .env or default to 3000
dbConnect(); // Connect to the database

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

//API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


