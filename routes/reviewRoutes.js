const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const LoginCollection = require('../db')

// Middleware untuk melindungi halaman yang membutuhkan login
function checkAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}


router.get('/user', checkAuth, (req, res) => {
    res.json({
        userId: req.session.userId,
        userName: req.session.userName,
        userEmail: req.session.userEmail
    });
});


// Mengambil semua ulasan
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId', 'name email');
        // Pastikan userId ada di setiap review
        const reviewsWithUserId = reviews.map(review => ({
            ...review.toObject(),
            userId: review.userId._id // Pastikan userId yang dikembalikan adalah _id
        }));
        console.log("Reviews fetched successfully:", reviewsWithUserId); // Debugging
        res.json(reviewsWithUserId);
    } catch (error) {
        console.error("Error fetching reviews from database:", error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});




router.post('/reviews', checkAuth, async (req, res) => {
    const { rating, text } = req.body;  // Ambil rating dan text dari body request
    const userId = req.session.userId;
    const userName = req.session.userName;
    const userEmail = req.session.userEmail;  // Ambil userEmail dari session

    if (!rating || !text || !userEmail) {  // Pastikan userEmail ada di session
        return res.status(400).json({ error: 'Rating, text, and userEmail are required' });
    }

    try {
        const newReview = new Review({
            userId,
            userName,
            userEmail,  // Gunakan email dari session
            rating,
            text
        });

        await newReview.save();
        res.status(201).json(newReview);  // Kembalikan review yang baru disimpan
    } catch (error) {
        res.status(500).json({ error: 'Error saving review' });
    }
});



// Memperbarui ulasan
router.put('/reviews/:id', checkAuth, async (req, res) => {
    const { rating, text } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, text },
            { new: true }   
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: 'Error updating review' });
    }
});

// Menghapus ulasan
router.delete('/reviews/:id', checkAuth, async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting review' });
    }
});

module.exports = router;
