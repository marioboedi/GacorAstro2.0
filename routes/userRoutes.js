const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" }); // Tentukan folder penyimpanan sementara
const User = require("../models/user"); // Ganti dengan model User

// Register pengguna baru
router.post("/register", async (req, res) => {
  const data = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    } else {
      await data.save();
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ error: "Server error, Try again." });
  }
});

// Login pengguna
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }
    if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    } // Simpan session pengguna

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email; // Pastikan email juga disimpan di session
    console.log(req.session);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

// PUT: Mengedit data pengguna

router.put("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Ambil data pengguna berdasarkan session userId
    const existingUser = await User.findById(req.session.userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    } // Gunakan data lama jika tidak ada data baru

    const updatedData = {
      name: name || existingUser.name,
      email: email || existingUser.email,
      password: password || existingUser.password,
    }; // Update data pengguna

    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      updatedData,
      { new: true } // Return updated document
    );

    req.session.userName = updatedUser.name; // Update nama di session
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE: Menghapus akun pengguna
router.delete("/user", async (req, res) => {
  try {
    const userId = req.session.userId; // Hapus data pengguna berdasarkan session userId
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to log out after deleting account" });
      }

      res.json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// POST: Upload profile picture

// POST: Mengunggah gambar profil

router.post(
  "/user/profile-pic",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } // Update path gambar profil di database
      const profilePicPath = `/uploads/${req.file.filename}`;
      user.profilePic = profilePicPath;
      await user.save();
      res.json({
        message: "Profile picture updated successfully",
        profilePic: profilePicPath,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile picture" });
    }
  }
);

// GET: Fetch profile picture
// routes/userRoutes.js

router.get("/user/profile-pic", async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const profilePicPath = user.profilePic || "/uploads/default-profile.png";
    res.json({ profilePic: profilePicPath });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

// DELETE: Menghapus foto profil pengguna

router.delete("/user/delete-profile-pic", async (req, res) => {
  try {
    const userId = req.session.userId; // Cari user berdasarkan session userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } // Hapus foto profil (set kembali ke default)
    user.profilePic = "/uploads/default-profile.png";
    await user.save();
    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ error: "Failed to delete profile picture" });
  }
});

module.exports = router;
