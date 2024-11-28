const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoginCollection', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },  // Pastikan email ada di sini
    rating: { type: Number, required: true },
    text: { type: String, required: true },
}, {
    timestamps: true,  // Menambahkan field createdAt dan updatedAt
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

