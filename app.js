const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const zodiacRoutes = require("./routes/zodiacRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const postRoutes = require("./routes/postRoutes"); // Import user routes

// Middleware dan konfigurasi
app.use(express.static("public"));
app.use(express.static("controllers"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key", // Ganti dengan string rahasia

    resave: false,

    saveUninitialized: false,
  })
);

app.use("/api", zodiacRoutes);
app.use("/api", reviewRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
// Middleware untuk melindungi halaman yang membutuhkan login

function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  next();
}

// Middleware untuk mencegah akses ke login/register jika sudah login

function checkNotAuth(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/");
  }

  next();
}

// Halaman utama (hanya untuk pengguna yang sudah login)

app.get("/", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Halaman login

app.get("/login", checkNotAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Halaman register

app.get("/register", checkNotAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Endpoint API untuk mendapatkan data pengguna

app.get("/api/user", checkAuth, (req, res) => {
  res.json({
    userName: req.session.userName,
    userEmail: req.session.userEmail, // Pastikan email pengguna juga terkirim
  });
});

// Logout

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Could not log out. Please try again." });
    }

    res.redirect("/login");
  });
});

// Halaman akun (hanya untuk pengguna yang sudah login)

app.get("/account", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "account.html"));
});

// Jalankan server

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
