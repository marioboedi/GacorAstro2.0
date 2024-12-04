const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL gambar
  category: { type: String, required: true }, // Kategori artikel
  content: { type: String, required: true }, // Isi artikel
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
