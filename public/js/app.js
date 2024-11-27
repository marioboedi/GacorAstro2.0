// Modul utama
angular.module('mainApp', ['articleApp', 'reviewApp', 'zodiacApp']);

// app.js
angular.module('articleApp', [])
    .controller('articleController', function($scope) {
        // Daftar kategori
        $scope.categories = ['LIFESTYLE', 'HEALTH', 'RELATIONSHIP', 'FASHION', 'CAREER'];

        // Daftar artikel
        $scope.articles = [
            {
                image: '/images/artikel-zodiak-1.jpeg',
                category: 'LIFESTYLE',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            },
            {
                image: '/images/artikel-zodiak-2.jpeg',
                category: 'HEALTH',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            },
            {
                image: '/images/artikel-zodiak-3.jpeg',
                category: 'RELATIONSHIP',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            },
            {
                image: '/images/artikel-zodiak-4.jpg',
                category: 'RELATIONSHIP',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            },
            {
                image: '/images/artikel-zodiak-5.jpeg',
                category: 'FASHION',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            },
            {
                image: '/images/artikel-zodiak-6.jpeg',
                category: 'FASHION',
                content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.'
            }
        ];
    });

// SECTION ULASAN
angular.module('reviewApp', [])
    .controller('reviewController', function($scope) {
        // Initial reviews data
        $scope.reviews = [
            {rating: 5, text: 'Excellent app! Highly recommend.'},
            {rating: 3, text: 'Good, but needs some improvements.'}
        ];

        // Model untuk rating dan review
        $scope.rating = 0;  // Rating awal
        $scope.newReview = { text: '' };

        // Fungsi untuk mengatur rating
        $scope.setRating = function(ratingValue) {
            $scope.rating = ratingValue;
        };

        // Fungsi untuk menambah review (CREATE)
        $scope.submitReview = function() {
            if ($scope.rating === 0 || !$scope.newReview.text) {
                alert('Silakan pilih rating dan beri ulasan.');
                return;
            }
            
            // Tambahkan review baru ke dalam array
            $scope.reviews.push({
                rating: $scope.rating,
                text: $scope.newReview.text
            });

            // Reset form
            $scope.newReview.text = '';
            $scope.rating = 0;
        };

        // Fungsi untuk mengedit review (UPDATE)
        $scope.editReview = function(index) {
            const review = $scope.reviews[index];
            $scope.newReview.text = review.text;
            $scope.rating = review.rating;

            // Hapus review yang sedang diedit
            $scope.reviews.splice(index, 1);
        };

        // Fungsi untuk menghapus review (DELETE)
        $scope.deleteReview = function(index) {
            $scope.reviews.splice(index, 1);
        };
    });
// SECTION ULASAN


    // SECTION ZODIAK

    // js/app.js

angular.module('zodiacApp', [])
.controller('zodiacController', function ($scope, $http) {
    $scope.months = [
        'January', 'February', 'March', 'April', 'May', 
        'June', 'July', 'August', 'September', 
        'October', 'November', 'December'
    ];

    // Mengambil data zodiak dari backend API
    $http.get('http://localhost:3000/api/zodiacs')
        .then(function (response) {
            $scope.zodiacs = response.data;
        }, function (error) {
            console.log('Error fetching zodiac data: ', error);
        });

    $scope.findZodiac = function () {
        const day = parseInt($scope.birthDay);
        const month = parseInt($scope.birthMonth);

        if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
            alert('Please enter a valid day and month!');
            return;
        }

        $scope.userZodiac = null;

        $scope.zodiacs.forEach(zodiac => {
            const start = zodiac.startDate;
            const end = zodiac.endDate;

            if (
                (month === start.month && day >= start.day) ||
                (month === end.month && day <= end.day) ||
                (start.month > end.month && (month === start.month && day >= start.day || month === end.month && day <= end.day))
            ) {
                $scope.userZodiac = zodiac;
            }
        });

        if (!$scope.userZodiac) {
            alert('No zodiac found for the given date.');
        }
    };
});


    angular.module('reviewApp', [])
    .controller('reviewController', function($scope, $http) {
        // Ambil nama dan email pengguna dari API saat halaman dimuat
        $http.get('/api/user')
            .then(function(response) {
                $scope.userName = response.data.userName;  // Simpan nama pengguna
                $scope.userEmail = response.data.userEmail; // Simpan email pengguna
            })
            .catch(function(error) {
                console.error('Error fetching user data:', error);
            });

        // Initial reviews data
        $scope.reviews = [
            {rating: 5, text: 'Excellent app! Highly recommend.', userName: 'John Doe', userEmail: 'john@example.com'},
        ];

        // Model untuk rating dan review
        $scope.rating = 0;  // Rating awal
        $scope.newReview = { text: '' };

        // Fungsi untuk mengatur rating
        $scope.setRating = function(ratingValue) {
            $scope.rating = ratingValue;
        };

        // Fungsi untuk menambah review (CREATE)
        $scope.submitReview = function() {
            if ($scope.rating === 0 || !$scope.newReview.text) {
                alert('Silakan pilih rating dan beri ulasan.');
                return;
            }

            // Tambahkan review baru ke dalam array
            $scope.reviews.push({
                rating: $scope.rating,
                text: $scope.newReview.text,
                userName: $scope.userName, // Menambahkan nama pengguna
                userEmail: $scope.userEmail // Menambahkan email pengguna
            });

            // Reset form
            $scope.newReview.text = '';
            $scope.rating = 0;
        };

        // Fungsi untuk mengedit review (UPDATE)
        $scope.editReview = function(index) {
            const review = $scope.reviews[index];
            $scope.newReview.text = review.text;
            $scope.rating = review.rating;

            // Hapus review yang sedang diedit
            $scope.reviews.splice(index, 1);
        };

        // Fungsi untuk menghapus review (DELETE)
        $scope.deleteReview = function(index) {
            $scope.reviews.splice(index, 1);
        };

    });
