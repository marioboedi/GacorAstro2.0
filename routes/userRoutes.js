// const express = require('express');
// const User = require('../models/user'); // Impor model User
// const router = express.Router();

// // Register pengguna baru
// router.post('/register', async (req, res) => {
//     const { name, password, email } = req.body;

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already registered' });
//         }

//         const newUser = new User({ name, password, email });
//         await newUser.save();
//         res.redirect('/login');
//     } catch (error) {
//         res.status(500).json({ error: 'Server error, Try again.' });
//     }
// });

// // Login pengguna
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user || user.password !== password) {
//             return res.status(400).json({ error: 'Incorrect email or password' });
//         }

//         req.session.userId = user._id;
//         req.session.userName = user.name;
//         req.session.userEmail = user.email;

//         res.redirect('/');
//     } catch (error) {
//         console.error('Error during login:', error);  // Menambahkan log untuk error
//         res.status(500).json({ error: 'An error occurred. Please try again.' });
//     }
// });

// // PUT: Mengedit data pengguna
// router.put('/', async (req, res) => {
//     const { name, email, password } = req.body;
//     const userId = req.session.userId;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.password = password || user.password;

//         await user.save();
//         req.session.userName = user.name;

//         res.json({ message: 'User updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to update user' });
//     }
// });

// // DELETE: Menghapus akun pengguna
// router.delete('/', async (req, res) => {
//     const userId = req.session.userId;

//     try {
//         const user = await User.findByIdAndDelete(userId);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         req.session.destroy();
//         res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to delete user' });
//     }
// });

// module.exports = router;
