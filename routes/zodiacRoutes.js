// server/routes/zodiacRoutes.js

const express = require('express');
const router = express.Router();
const Zodiac = require('../models/zodiac');

// Endpoint untuk mendapatkan semua data zodiak
router.get('/zodiacs', async (req, res) => {
    try {
        const zodiacs = await Zodiac.find();
        res.json(zodiacs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching zodiac data' });
    }
});

module.exports = router;
