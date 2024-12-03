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
 


