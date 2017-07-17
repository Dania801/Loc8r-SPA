var request = require('request') ;
var apiOptions = {
  server: 'http://localhost:3000'
}

// Render error
var _showError = function(req , res , status){
  var title , content ;
  if(status === 404){
    title = "404 , Page not found" ;
    content = "Oh dear , Looks like we can't find the page. Sorry" ;
  } else {
    title = status + " , something's gone wrong " ;
    content = "Something somewhere has gone wrong";
  };
  res.status(status) ;
  res.render('generic-text' , {
    title: title ,
    content: content
  });
};

// Main Location page (render)
var renderHomePage = function(req , res , body){
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    } ,
    sidebar : "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations : body
    });
}

// Main Location page (request)
module.exports.homelist = function(req , res){
  var path = '/api/locations' ;
  var requestOptions = {
    url: apiOptions.server + path ,
    method: "GET" ,
    json: {},
    qs: {}
  }
  request(requestOptions , function(err , response , body){
    if(response.statusCode === 200){
      renderHomePage(req , res , body);
    } else {
      _showError(req , res , response.statusCode);
    }
  });
};

// Detail page (render)
var renderDetailPage = function(req , res , body){
  res.render('location-info' , {
    title: 'Location Info' ,
    pageHeader: {title: body.name} ,
    locationInfo: body
  });
};

// Detail page (request)
module.exports.locationInfo = function(req , res){
  var path = '/api/locations/' + req.params.locationid ;
  var requesOptions = {
    url: apiOptions.server + path ,
    method: "GET" ,
    json: {} ,
    qs: {}
  };
  request(requesOptions , function(err , response , body){
    if(response.statusCode === 200){
      renderDetailPage(req , res , body) ;
    } else {
      _showError(req , res , response.statusCode) ;
    }
  });
};

// Review form (render)
var renderReviewForm = function(req , res , body){
  res.render('location-review-form' , {
    title: "Add review",
    pageHeader : {title: 'Review ' + body.name}
  }) ;
};

// Review form (request)
module.exports.addReview = function(req , res){
  var path = '/api/locations/' + req.params.locationid ;
  var requestOptions = {
    url: apiOptions.server + path ,
    method: "GET" ,
    json: {} ,
    qs: {}
  };
  request(requestOptions , function(err , response , body){
    console.log(body._id) ;
    console.log(body.name) ;
    renderReviewForm(req , res , body) ;
  });
};

module.exports.doAddReview = function(req , res){
  var path = '/api/locations/' + req.params.locationid + '/reviews';
  console.log(req.params.locationid) ;
  var postData = {
    author: req.body.name ,
    rate: parseInt(req.body.rating , 10) ,
    comment: req.body.review
  } ;
  var requestOptions = {
    url: apiOptions.server + path ,
    method: "POST",
    json: postData
  }
  request(requestOptions , function(err , response , body){
    console.log(body) ;
    if(response.statusCode === 201)
      res.redirect('/location/' + req.params.locationid) ;
    else {
      _showError(req , res , response.statusCode) ;
    }
  });
};
