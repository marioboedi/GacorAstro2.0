angular
  .module("articleApp", [])
  .controller("articleController", function ($scope, $http) {
    $http({
      method: "GET",
      url: "http://localhost:3000/api/articles",
      headers: {
        email: "admin@gmail.com",
        password: "admin123"
      }
    })
    .then((response) => {
      $scope.articles = response.data;
    })
    .catch((error) => {
      console.error("Error fetching articles:", error);
    });

});
