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

    $scope.searchQuery = ""; // Default untuk fitur search

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
