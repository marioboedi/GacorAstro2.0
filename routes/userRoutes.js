const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ganti dengan model User

// Register pengguna baru
router.post('/register', async (req, res) => {
    const data = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    });

    try {
        const existingUser = await User.findOne({ email: req.body.email });

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
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: 'Incorrect email or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Simpan session pengguna
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;  // Pastikan email juga disimpan di session

        console.log(req.session);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

// PUT: Mengedit data pengguna
router.put('/user', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Ambil data pengguna berdasarkan session userId
        const existingUser = await User.findById(req.session.userId);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Gunakan data lama jika tidak ada data baru
        const updatedData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            password: password || existingUser.password,
        };

        // Update data pengguna
        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            updatedData,
            { new: true } // Return updated document
        );

        req.session.userName = updatedUser.name; // Update nama di session

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE: Menghapus akun pengguna
router.delete('/user', async (req, res) => {
    try {
        const userId = req.session.userId;

        // Hapus data pengguna berdasarkan session userId
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log out after deleting account' });
            }
            res.json({ message: 'User deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
