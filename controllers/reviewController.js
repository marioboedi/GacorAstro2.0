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
