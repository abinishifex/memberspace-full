const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        
        if (!normalizedEmail || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email: normalizedEmail, password: hashPassword });
        
        return res.status(201).json({ 
            user: { id: user._id, email: user.email } 
        });

    } catch (err) {
        console.error("Register Error:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const normalizedEmail = String(email || '').trim().toLowerCase();
        
        if (!normalizedEmail || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        return res.json({ 
            user: { id: user._id, email: user.email } 
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// 3. ME ROUTE
router.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ user });

    } catch (err) {
        console.error("Me Error:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// 4. LOGOUT ROUTE
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not logout' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out' });
    });
});

module.exports = router;
