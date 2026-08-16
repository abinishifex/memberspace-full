const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.get('/', async(req,res) => {
    try{
            const posts = await Post.find().sort({ createdAt: -1});
            const isLoggedIn = !!req.session.userId;

            const shaped = posts.map((post) => ({
                id: post._id,
                title: post.title,
                isPremium: post.isPremium,
                Content: post.isPremium && !isLoggedIn
                ? null
                : post.content,
            }));
            res.json({ posts: shaped });

    }catch(err){
        res.status(500).json({error: 'Server Error'})
    }
})

router.post('/', async(req, res) => {
    if(!req.session.userId){
        return res.status(401).json({ error: 'Not authenticated'});
    }

    try {
        const { title, content, isPremium} = req.body;
        const post = await Post.create({
            title, content, isPremium: !!isPremium, author: req.session.userId,
        });
        res.status(201).json({ post });
    } catch (err) {
        res.status(500).json({ error: 'Server error'});
    }
});


module.exports = router;
