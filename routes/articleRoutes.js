const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// Endpoint untuk mendapatkan semua artikel
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

module.exports = router;
