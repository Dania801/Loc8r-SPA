angular.module('loc8rApp', []);

var locationListCtrl = function ($scope , $http) {
  $scope.message = "Searching for nearby places . . . ." ;
  $http.get("/api/locations").then(function(response) {
        $scope.data = response.data;
        $scope.message = '';
    },function(response){
      $scope.message = "Something's gone wrong" ;
    });
};

var ratingStars = function () {
  return {
    scope : {
      thisRating : '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  };
};

angular.module('loc8rApp')
       .controller('locationListCtrl', locationListCtrl)
       .directive('ratingStars', ratingStars)
       .service('loc8rData' , loc8rData);
