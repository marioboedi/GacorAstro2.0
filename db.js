const mongoose = require('mongoose');

// URL koneksi ke database MongoDB
const url = 'mongodb://127.0.0.1:27017/GacorAstroV2';

// Menghubungkan ke database MongoDB
mongoose.connect(url)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Connection failed:', error);
    });

module.exports = mongoose; // Ekspor koneksi ke database
