// Modul utama
angular.module("mainApp", ["articleApp", "reviewApp", "zodiacApp", "postApp"]);
 
// app.js
angular
  .module("articleApp", [])
  .controller("articleController", function ($scope) {
    // Daftar kategori
    $scope.categories = [
      "LIFESTYLE",
      "HEALTH",
      "RELATIONSHIP",
      "FASHION",
      "CAREER",
    ];
 
    // Daftar artikel
    $scope.articles = [
      {
        image: "/images/artikel-zodiak-1.jpeg",
        category: "LIFESTYLE",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
      {
        image: "/images/artikel-zodiak-2.jpeg",
        category: "HEALTH",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
      {
        image: "/images/artikel-zodiak-3.jpeg",
        category: "RELATIONSHIP",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
      {
        image: "/images/artikel-zodiak-4.jpg",
        category: "RELATIONSHIP",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
      {
        image: "/images/artikel-zodiak-5.jpeg",
        category: "FASHION",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
      {
        image: "/images/artikel-zodiak-6.jpeg",
        category: "FASHION",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. A quaerat quo beatae voluptates error quisquam ratione vel fugit modi cumque.",
      },
    ];
  });
 
angular
  .module("reviewApp", [])
  .controller("reviewController", function ($scope, $http) {
    // Initial reviews data
    $scope.reviews = [];
 
    // Model untuk rating dan review
    $scope.rating = 0; // Rating awal
    $scope.newReview = { text: "" };
 
    // Ambil data pengguna yang sedang login
    $http
      .get("/api/user")
      .then(function (response) {
        $scope.loggedInUser = response.data; // Simpan data pengguna yang sedang login
        localStorage.setItem("loggedInUser", JSON.stringify(response.data)); // Simpan di localStorage
      })
      .catch(function (error) {
        console.error("Error fetching user data:", error);
      });
 
    // Memuat data pengguna dari localStorage saat halaman di-refresh
    let storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      $scope.loggedInUser = JSON.parse(storedUser); // Ambil data pengguna dari localStorage
    } else {
      // Jika tidak ada, ambil dari API
      $http
        .get("/api/user")
        .then(function (response) {
          $scope.loggedInUser = response.data;
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify($scope.loggedInUser)
          ); // Simpan di localStorage
        })
        .catch(function (error) {
          console.error("Error fetching user data:", error);
        });
    }
 
    // Ambil semua ulasan dari API
    $http
      .get("/api/reviews")
      .then(function (response) {
        console.log("Fetched reviews:", response.data); // Debugging
        $scope.reviews = response.data; // Isi data ulasan
      })
      .catch(function (error) {
        console.error("Error fetching reviews:", error);
      });
 
    // Fungsi untuk mengatur rating
    $scope.setRating = function (ratingValue) {
      $scope.rating = ratingValue;
    };
 
    // Fungsi untuk menambah review (CREATE)
    $scope.submitReview = function () {
      if ($scope.rating === 0 || !$scope.newReview.text) {
        alert("Silakan pilih rating dan beri ulasan.");
        return;
      }
 
      if ($scope.editingIndex !== null) {
        // Mode edit
        const review = $scope.reviews[$scope.editingIndex];
        $http
          .put("/api/reviews/" + review._id, {
            rating: $scope.rating,
            text: $scope.newReview.text,
            userName: review.userName, // Pastikan userName tetap ada
            userEmail: review.userEmail,
          })
          .then(function (response) {
            alert("Review updated successfully");
            $scope.reviews[$scope.editingIndex] = response.data; // Perbarui ulasan di daftar
            $scope.editingIndex = null; // Reset mode edit
            $scope.newReview.text = ""; // Kosongkan form
            $scope.rating = 0;
          })
          .catch(function (error) {
            alert("Error updating review");
            console.error(error);
          });
      } else {
        // Mode tambah ulasan baru
        const userName = $scope.loggedInUser.userName;
        const userEmail = $scope.loggedInUser.userEmail;
        const profilePic = $scope.loggedInUser.profilePic; // Foto profil pengguna dari session/localStorage
 
        const reviewData = {
          rating: $scope.rating,
          text: $scope.newReview.text,
          userName: userName,
          userEmail: userEmail,
          profilePic: profilePic,
        };
 
        $http
          .post("/api/reviews", reviewData)
          .then(function (response) {
            alert("Review submitted successfully");
            $scope.reviews.push(response.data); // Tambahkan ulasan baru ke daftar
            $scope.newReview.text = ""; // Kosongkan form
            $scope.rating = 0;
          })
          .catch(function (error) {
            alert("Error submitting review");
            console.error(error);
          });
      }
    };
 
    $scope.cancelEdit = function () {
      $scope.editingIndex = null;
      $scope.newReview.text = "";
      $scope.rating = 0;
    };
 
    $scope.editingIndex = null; // Variabel untuk melacak indeks ulasan yang sedang diedit
 
    // Fungsi untuk mengedit review (UPDATE)
    $scope.editReview = function (index) {
      const review = $scope.reviews[index];
      $scope.newReview.text = review.text; // Isi teks ulasan ke dalam form
      $scope.rating = review.rating; // Isi rating ke dalam form
      $scope.editingIndex = index; // Simpan indeks ulasan yang sedang diedit
    };
 
    // Fungsi untuk menghapus review (DELETE)
    $scope.deleteReview = function (index) {
      const review = $scope.reviews[index];
 
      if (review.userId === $scope.loggedInUser.userId) {
        $http
          .delete("/api/reviews/" + review._id)
          .then(function (response) {
            $scope.reviews.splice(index, 1); // Hapus review dari array
          })
          .catch(function (error) {
            console.error("Error deleting review:", error);
          });
      } else {
        alert("You cannot delete someone else's review.");
      }
    };
 
    // Fungsi untuk memeriksa apakah ulasan milik pengguna yang sedang login
    $scope.isReviewOwner = function (review) {
      return (
        review.userId &&
        $scope.loggedInUser &&
        review.userId.toString() === $scope.loggedInUser.userId.toString()
      );
    };
  });
 
// SECTION ZODIAK
 
// js/app.js
 
angular
  .module("zodiacApp", [])
  .controller("zodiacController", function ($scope, $http) {
    $scope.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
 
    // Mengambil data zodiak dari backend API
    $http.get("http://localhost:3000/api/zodiacs").then(
      function (response) {
        $scope.zodiacs = response.data;
      },
      function (error) {
        console.log("Error fetching zodiac data: ", error);
      }
    );
 
    $scope.findZodiac = function () {
      const day = parseInt($scope.birthDay);
      const month = parseInt($scope.birthMonth);
 
      if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
        alert("Please enter a valid day and month!");
        return;
      }
 
      $scope.userZodiac = null;
 
      $scope.zodiacs.forEach((zodiac) => {
        const start = zodiac.startDate;
        const end = zodiac.endDate;
 
        if (
          (month === start.month && day >= start.day) ||
          (month === end.month && day <= end.day) ||
          (start.month > end.month &&
            ((month === start.month && day >= start.day) ||
              (month === end.month && day <= end.day)))
        ) {
          $scope.userZodiac = zodiac;
        }
      });
 
      if (!$scope.userZodiac) {
        alert("No zodiac found for the given date.");
      }
    };
  });
 
  angular
  .module("postApp", [])
  .controller("postController", function ($scope, $http) {
    $scope.posts = [];
    $scope.newPost = { text: "", imageUrl: "" };
    $scope.editingIndex = null;
    $scope.editingPostId = null;
    $scope.loggedInUser = null;

    // Fungsi untuk memuat data pengguna login
    function fetchLoggedInUser() {
      // Cek apakah pengguna sudah login
      $http.get("/api/user")
        .then(function (response) {
          $scope.loggedInUser = response.data;
          fetchPosts(); // Memuat semua postingan
        })
        .catch(function (error) {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data");
        });
    }

    // Fungsi untuk memuat semua postingan
    function fetchPosts() {
      $http
        .get("/api/posts")
        .then(function (response) {
          $scope.posts = response.data;
        })
        .catch(function (error) {
          console.error("Error fetching posts:", error);
        });
    }

     // Fungsi untuk memeriksa apakah pengguna login adalah pemilik postingan
     $scope.isPostOwner = function(post) {
      return $scope.loggedInUser && post.userId === $scope.loggedInUser.userId;
    };

    // Fungsi untuk mengirimkan postingan baru atau update
    $scope.submitPost = function () {
      const postData = {
        text: $scope.newPost.text,
        imageUrl: $scope.newPost.imageUrl,
        userId: $scope.loggedInUser.userId // Menambahkan userId saat membuat postingan
      };

      if ($scope.editingPostId) {
        $http
          .put("/api/posts/" + $scope.editingPostId, postData)
          .then(function (response) {
            $scope.posts[$scope.editingIndex] = response.data;
            $scope.cancelEdit();
            alert("Post updated successfully");
          })
          .catch(function (error) {
            console.error("Error updating post:", error);
            alert("Error updating post");
          });
      } else {
        $http
          .post("/api/posts", postData)
          .then(function (response) {
            $scope.newPost.text = "";
            $scope.newPost.imageUrl = "";
            fetchPosts(); // Refresh data setelah postingan baru
            alert("Post created successfully");
          })
          .catch(function (error) {
            console.error("Error creating post:", error);
            alert("Error creating post");
          });
      }
    };

    // Fungsi untuk menghapus postingan
    $scope.deletePost = function (index) {
      const post = $scope.posts[index];
      // Pastikan hanya pengguna yang dapat menghapus postingannya sendiri
      if (post.userId === $scope.loggedInUser.userId) {
        $http
          .delete("/api/posts/" + post._id)
          .then(function () {
            fetchPosts(); // Refresh data setelah menghapus postingan
            alert("Post deleted successfully");
          })
          .catch(function (error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post");
          });
      } else {
        alert("You can only delete your own posts.");
      }
    };

    // Fungsi untuk memulai edit postingan
    $scope.editPost = function (index) {
      const post = $scope.posts[index];
      // Pastikan hanya pengguna yang dapat mengedit postingannya sendiri
      if (post.userId === $scope.loggedInUser.userId) {
        $scope.newPost.text = post.text;
        $scope.newPost.imageUrl = post.imageUrl;
        $scope.editingIndex = index;
        $scope.editingPostId = post._id;
      } else {
        alert("You can only edit your own posts.");
      }
    };

    // Fungsi untuk membatalkan edit
    $scope.cancelEdit = function () {
      $scope.editingIndex = null;
      $scope.editingPostId = null;
      $scope.newPost.text = "";
      $scope.newPost.imageUrl = "";
    };

    // Fungsi untuk menampilkan gambar modal
    $scope.modalImage = "";
    $scope.setModalImage = function (imageUrl) {
      $scope.modalImage = imageUrl;
    };

    // Panggil fungsi untuk mendapatkan data pengguna saat halaman dimuat
    fetchLoggedInUser();
  });


