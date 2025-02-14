require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment3')
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', err => console.error('❌ MongoDB Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 10, max: 100 },
    email: { type: String, required: true, unique: true },
    occupation: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ name: 1 });
        res.render('index', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/analytics', async (req, res) => {
    try {
        const ageStats = await User.aggregate([
            { $group: { _id: "$age", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const occupationStats = await User.aggregate([
            { $group: { _id: "$occupation", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.render('analytics', { ageStats, occupationStats });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).send('Server Error');
    }
});

// API Routes
app.post('/api/users', async (req, res) => {
    try {
        const { name, age, email, occupation } = req.body;
        if (!name || !email || !age || !occupation) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ name, age, email, occupation });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', sortBy = 'name', order = 'asc' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search ? { name: new RegExp(search, 'i') } : {};
        const users = await User.find(query)
            .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);
        res.json({ users, total });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, age, email, occupation } = req.body;
        if (!name || !email || !age || !occupation) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, age, email, occupation }, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));