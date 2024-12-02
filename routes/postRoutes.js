const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/user');
const mongoose = require('mongoose');
 
 
// Middleware untuk melindungi halaman yang membutuhkan login
function checkAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}
 
// Mengambil semua postingan
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name email profilePic createdAt');
        const postsWithUserId = posts.map(post => ({
            ...post.toObject(),
            userId: post.userId._id, // Pastikan userId yang dikembalikan adalah _id
            profilePic: post.userId.profilePic || '/uploads/default-profile.png', // Gunakan default jika kosong
        }));
        res.json(postsWithUserId);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});
 
// Membuat postingan baru
router.post('/posts', checkAuth, async (req, res) => {
    const { text, imageUrl } = req.body;
    const userId = req.session.userId;
    const userName = req.session.userName;
    const userEmail = req.session.userEmail;
    const profilePic = req.session.profilePic || '/uploads/default-profile.png';
 
    if (!text && !imageUrl) {
        return res.status(400).json({ error: 'Text or image URL is required' });
    }
 
    try {
        const newPost = new Post({
            userId,
            userName,
            userEmail,
            profilePic,
            text,
            imageUrl,
        });
 
        await newPost.save();
        res.status(201).json(newPost);  // Kembalikan post yang baru disimpan
    } catch (error) {
        res.status(500).json({ error: 'Error saving post' });
    }
});
 
// Memperbarui postingan
router.put('/posts/:id', checkAuth, async (req, res) => {
    const { text, imageUrl } = req.body;
 
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { text, imageUrl },
            { new: true }
        );
 
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
 
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Error updating post' });
    }
});
 
// Menghapus postingan
router.delete('/posts/:id', checkAuth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }
 
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
 
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
 
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
    }
});
 
module.exports = router;