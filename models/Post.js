const mongoose = require('mongoose');
 
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },  // Pastikan email ada di sini
    text: { type: String, required: true },
    imageUrl: { type: String, default: null }, // Gambar akan disimpan sebagai URL
}, {
    timestamps: true,  // Menambahkan field createdAt dan updatedAt
});
 
const Post = mongoose.model('Post', postSchema);
 
module.exports = Post;