const express = require('express');
const session = require('express-session');
const loginCollection = require('./db'); // Import database dan model
const path = require('path');
const app = express();

// Middleware dan konfigurasi
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'your_secret_key', // Ganti dengan string rahasia
        resave: false,
        saveUninitialized: false,
    })
);

// Middleware untuk melindungi halaman yang membutuhkan login
function checkAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

// Middleware untuk mencegah akses ke login/register jika sudah login
function checkNotAuth(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/');
    }
    next();
}

// Halaman utama (hanya untuk pengguna yang sudah login)
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Halaman login
app.get('/login', checkNotAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Halaman register
app.get('/register', checkNotAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Endpoint API untuk mendapatkan data pengguna
app.get('/api/user', checkAuth, (req, res) => {
    res.json({ userName: req.session.userName });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out. Please try again.' });
        }
        res.redirect('/login');
    });
});

// Halaman akun (hanya untuk pengguna yang sudah login)
app.get('/account', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'account.html'));
});

// Register pengguna baru
app.post('/register', async (req, res) => {
    const data = new loginCollection({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    });

    try {
        const existingUser = await loginCollection.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        } else {
            await data.save();
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error, Try again.' });
    }
});

// Login pengguna
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginCollection.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: 'Incorrect email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Simpan session pengguna
        req.session.userId = user._id;
        req.session.userName = user.name;

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
