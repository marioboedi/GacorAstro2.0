const mongoose = require('mongoose');

// URL koneksi ke database MongoDB
const url = 'mongodb://127.0.0.1:27017/LoginPage';

// Menghubungkan ke database MongoDB
mongoose.connect(url)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.log('Connection failed', error);
    });

// Mendefinisikan skema untuk koleksi login
const loginSchema = new mongoose.Schema({
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
    }
});

// Mendefinisikan model berdasarkan skema yang telah dibuat
const LoginCollection = mongoose.model('LoginCollection', loginSchema);

module.exports = LoginCollection;
