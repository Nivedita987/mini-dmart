// 1. Load environment variables first
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mini D-Mart API is running' });
});

// 5. Routes
app.use('/api/auth', authRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);

app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/returns', require('./routes/returnRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));