const mongoose = require('../db'); // Import koneksi database

// Definisi schema untuk koleksi user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilePic: {  

        type: String,  
        default: '/uploads/default-profile.png'  
    },  
});

// Buat model berdasarkan schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Ekspor model
