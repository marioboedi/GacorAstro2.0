const mongoose = require('mongoose');
const Zodiac = require('./models/zodiac'); // Pastikan ini sesuai dengan lokasi model Zodiac
const Article = require('./models/article'); 

// Data Zodiak
const zodiacs = [
    { name: 'Capricorn', symbol: 'P', dateRange: '22 December - 19 January', startDate: { day: 22, month: 12 }, endDate: { day: 19, month: 1 }, link: 'zodiak/capricorn.html' },
    { name: 'Aquarius', symbol: 'Q', dateRange: '20 January - 18 February', startDate: { day: 20, month: 1 }, endDate: { day: 18, month: 2 }, link: 'zodiak/aquarius.html' },
    { name: 'Pisces', symbol: 'S', dateRange: '19 February - 20 March', startDate: { day: 19, month: 2 }, endDate: { day: 20, month: 3 }, link: 'zodiak/pisces.html' },
    { name: 'Aries', symbol: 'N', dateRange: '21 March - 19 April', startDate: { day: 21, month: 3 }, endDate: { day: 19, month: 4 }, link: 'zodiak/aries.html' },
    { name: 'Taurus', symbol: 'O', dateRange: '20 April - 20 May', startDate: { day: 20, month: 4 }, endDate: { day: 20, month: 5 }, link: 'zodiak/taurus.html' },
    { name: 'Gemini', symbol: 'R', dateRange: '21 May - 20 June', startDate: { day: 21, month: 5 }, endDate: { day: 20, month: 6 }, link: 'zodiak/gemini.html' },
    { name: 'Cancer', symbol: 'T', dateRange: '21 June - 22 July', startDate: { day: 21, month: 6 }, endDate: { day: 22, month: 7 }, link: 'zodiak/cancer.html' },
    { name: 'Leo', symbol: 'U', dateRange: '23 July - 22 August', startDate: { day: 23, month: 7 }, endDate: { day: 22, month: 8 }, link: 'zodiak/leo.html' },
    { name: 'Virgo', symbol: 'V', dateRange: '23 August - 22 September', startDate: { day: 23, month: 8 }, endDate: { day: 22, month: 9 }, link: 'zodiak/virgo.html' },
    { name: 'Libra', symbol: 'W', dateRange: '23 September - 22 October', startDate: { day: 23, month: 9 }, endDate: { day: 22, month: 10 }, link: 'zodiak/libra.html' },
    { name: 'Scorpio', symbol: 'X', dateRange: '23 October - 21 November', startDate: { day: 23, month: 10 }, endDate: { day: 21, month: 11 }, link: 'zodiak/scorpio.html' },
    { name: 'Sagittarius', symbol: 'Y', dateRange: '22 November - 21 December', startDate: { day: 22, month: 11 }, endDate: { day: 21, month: 12 }, link: 'zodiak/sagittarius.html' }
];

const articles = [
    { image: "/images/artikel-zodiak-1.jpeg", category: "LIFESTYLE", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
    { image: "/images/artikel-zodiak-2.jpeg", category: "HEALTH", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
    { image: "/images/artikel-zodiak-3.jpeg", category: "RELATIONSHIP", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
    { image: "/images/artikel-zodiak-4.jpg", category: "FASHION", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
    { image: "/images/artikel-zodiak-5.jpeg", category: "RELATIONSHIP", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
    { image: "/images/artikel-zodiak-6.jpeg", category: "LIFESTYLE", content: "Lorem ipsum dolor sit amet consectetur adipisicing elit." },
]


// Fungsi untuk seeding data
async function seedDatabase() {
    try {
      // Hapus data lama
      await Zodiac.deleteMany();
      await Article.deleteMany();
  
      // Masukkan data baru
      await Zodiac.insertMany(zodiacs);
      await Article.insertMany(articles);
  
      console.log("Database has been successfully seeded!");
    } catch (error) {
      console.error("Error seeding the database:", error);
    } finally {
      mongoose.disconnect();
    }
  }
  
  // Koneksi ke MongoDB dan jalankan seeding
  mongoose.connect("mongodb://127.0.0.1:27017/GacorAstroV2")
    .then(() => {
      console.log("Connected to the GacorAstro database");
      seedDatabase();
    })
    .catch((error) => {
      console.error("Failed to connect to GacorAstro database:", error);
    });
