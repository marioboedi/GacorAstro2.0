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
            // Update data postingan di $scope.posts
            $scope.posts[$scope.editingIndex] = {
                ...response.data, // Data dari server
                userId: $scope.loggedInUser.userId, // Tambahkan userId
                profilePic: $scope.posts[$scope.editingIndex].profilePic, // Tetap gunakan profilePic lama
                userName: $scope.posts[$scope.editingIndex].userName, // Tetap gunakan userName lama
            };
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