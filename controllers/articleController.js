angular
  .module("articleApp", [])
  .controller("articleController", function ($scope, $http) {
    $http.get("http://localhost:3000/api/articles")
      .then((response) => {
        $scope.articles = response.data;
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });

    $scope.categories = ["LIFESTYLE", "HEALTH", "RELATIONSHIP", "FASHION", "CAREER"];
  });
