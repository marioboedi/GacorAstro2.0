// server/models/zodiac.js

const mongoose = require('mongoose');

// Mendefinisikan skema untuk koleksi Zodiac
const zodiacSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    dateRange: {
        type: String,
        required: true
    },
    startDate: {
        day: { type: Number, required: true },
        month: { type: Number, required: true }
    },
    endDate: {
        day: { type: Number, required: true },
        month: { type: Number, required: true }
    },
    link: {
        type: String,
        required: true
    }
});

// Mendefinisikan model berdasarkan skema
const Zodiac = mongoose.model('Zodiac', zodiacSchema);

module.exports = Zodiac;
