const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const cookieParser = require('cookie-parser')

const app = express()
require('dotenv').config();
connectDB();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, secure: false, maxAge: 1000* 60 * 60 * 24},
}));

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));