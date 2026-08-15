const express = require('express');
const User =  require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const router = express.Router()


router.post('/register', async (req, res) => {

    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error: 'Email and password required'});    

        }
         const existing =  await User.findOne({ email});
         if(existing){

            return res.status(409).json({error: 'Email already exist'});

            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({email, password: hashPassword});

                res.status(201).json({user: {id: user._id, email: user.email}})
         }
    }catch(err){
        res.status(500).json({error: 'server error'});
    }
});


router.post('/login', async (req, res) => {
    try{
    const {email, password} = req.body;

    const user = await user.findOne({email});
    if(!user){
        return res.status(401).json({error: 'Invalid credential'});
    }
     const match  = await bcrypt.compare(password, user.password);
     if(!match){
        return res.status(401).json({error: 'Invalid credential'})
     }

     req.session.userId = user._id;
     res.json({user: {id: user._id, email: user.email}});
     }catch(err){
        res.status(500).json({error: 'Server error'})
     }
});

router.get('/me', async (req,res) => {
    if(!req.session.userId){
        res.status(401).json({error: 'Not authenticated'})
    }
    const user = await User.findById(req.session.userId).select('-password');
    res.json({ User});
});

router.post('/logout', async (req, res) => {
    req.session.destroy((err)  => {
            if (err) return res.status(500).json({error: 'could not logout'});
                res.clearCookie('connect.sid');
            res.json({message: 'Logged out'})
    });
});

module.exports = router;