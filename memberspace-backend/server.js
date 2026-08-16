const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allows your React app to communicate
    credentials: true,                                         // Allows session cookies to pass through
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'memberspace-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,     () => console.log(`server running on http://localhost:${PORT}`));

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);