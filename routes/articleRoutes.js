const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// Middleware untuk memeriksa apakah pengguna adalah admin
function isAdmin(req, res, next) {
    const adminCredentials = {
        email: "admin@gmail.com",
        password: "admin123"
    };

    const { email, password } = req.headers;

    // Validasi email dan password admin dari headers
    if (email === adminCredentials.email && password === adminCredentials.password) {
        next(); // Admin terverifikasi, lanjutkan ke endpoint berikutnya
    } else {
        res.status(403).json({ error: "Akses ditolak. Anda bukan admin." });
    }
}

// Semua route di bawah ini memerlukan autentikasi admin
router.use(isAdmin);

// Route untuk mendapatkan semua artikel
router.get("/articles", async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil artikel" });
    }
});

// Route untuk menambahkan artikel
router.post("/articles", isAdmin, (req, res) => {
  const { content, image, category } = req.body;
  const newArticle = new Article({
    content,
    image,
    category,
  });

  newArticle
    .save()
    .then((article) => {
      res.status(201).json(article);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error saving article.", error });
    });
});


// Route untuk menghapus artikel
router.delete("/articles/:id", async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Artikel berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ error: "Gagal menghapus artikel" });
    }
});

// Route untuk mengedit artikel
router.put("/articles/:id", async (req, res) => {
    try {
        const { category, content, image } = req.body;
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { category, content, image },
            { new: true }
        );
        res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(400).json({ error: "Gagal mengedit artikel" });
    }
});

module.exports = router;
