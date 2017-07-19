angular.module('loc8rApp').controller('homeCtrl', homeCtrl);

function homeCtrl ($http) {
  var self = this ;
  self.pageHeader = {
    title: 'Loc8r',
    strapline: 'Find places to work with wifi near you!',
  };
  self.sidebar = "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.";
  self.message = "Checking your location . . . . " ;

  $http.get("/api/locations").then(function(response) {
        this.data = response.data;
        this.message = '';
    },function(response){
      this.message = "Something's gone wrong" ;
    });
}
