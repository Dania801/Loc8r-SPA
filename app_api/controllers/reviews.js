var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res , status , content){
    res.status(status) ;
    res.json(content) ;
};

// Set average rate based on reviews
var updateAverageRating = function(locationid){
  Loc
    .findById(locationid)
    .select("rating reviews")
    .exec(function(err , location){
      if(!err){
        console.log("i'm in update function")
        doSetAverageRating(location) ;
      }
    })
};

// Calculate average rate
var doSetAverageRating = function(location){
  var reviewCount , ratingTotal , ratingAverage ;
  console.log("i'm in set function")
  if(location.reviews && location.reviews.length > 0){

    reviewCount = location.reviews.length ;
    ratingTotal = 0 ;
    for(var i = 0 ; i < reviewCount ; i++){
      ratingTotal += location.reviews[i].reviewRate ;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount , 10) ;
    location.rating = ratingAverage ;
    location.save(function(err){
      if(err){
        console.log(err) ;
      }else{
        console.log('Average rate is updated to : ' , ratingAverage) ;
      }
    })
  }
};

// Add a review
module.exports.reviewsCreate = function(req , res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select('reviews')
      .exec(function(err , location){
        if(!location){
          sendJsonResponse(res , 404 , {"message" : "No location found"}) ;
        } else if(err){De
          sendJsonResponse(res , 404 , err) ;
        } else {
            location.reviews.push({
              reviewRate: req.body.rate ,
              author: req.body.author ,
              comment: req.body.comment
            });
          location.save(function(err , location){
            var thisReview ;
            if(err){
              sendJsonResponse(res , 404 , err) ;
            }else {
              console.log(location._id) ;
              updateAverageRating(location._id) ;
              thisReview = location.reviews[location.reviews.length -1] ;
              sendJsonResponse(res , 201 , thisReview) ;
            };
          });
        };
      });
  } else {
    sendJsonResponse(res , 404 , {"message" : "No locationid"}) ;
  };
};

// Display a review
module.exports.reviewsReadOne = function(req , res){
  if (req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec(function(err , location){
        if(!location){
          sendJsonResponse(res , 404 , {"message" : "No reviews found!"}) ;
          return ;
        }
        else if (err){
          sendJsonResponse(res , 404 , err) ;
          return
        }
        if (location.reviews && location.reviews.length > 0){
          review = location.reviews.id(req.params.reviewid) ;

              sendJsonResponse(res , 200 , location.reviews[0].timestamp) ;

        }
        else {
          sendJsonResponse(res , 404 , {"message" : "No review found!"}) ;
        }
      });
  }
  else {
    sendJsonResponse(res , 404 , "locationid or reviewid are isn't specified") ;
  }
};

// Update a review
module.exports.reviewsUpdateOne = function(req , res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select('reviews rating')
      .exec(function(err , location){
        if(err){
          sendJsonResponse(res , 404 , err) ;
        } else if(!location){
          sendJsonResponse(res , 404 , {"message" : "Location is not fount"}) ;
        } else {
          if(location.reviews && location.reviews.length > 0){
            var theReview = location.reviews.id(req.params.reviewid) ;
            if(!theReview){
              sendJsonResponse(res , 404 , {"message" : "The requested review isn't found"}) ;
            }else {


              theReview.author = req.body.author ;
              theReview.reviewRate = req.body.rate ;
              theReview.comment = req.body.comment ;

              location.save(function(err , location){
                if(err){
                  sendJsonResponse(res , 404 , err) ;
                } else {
                  updateAverageRating(location._id) ;
                  sendJsonResponse(res , 200 , location) ;
                };
              });
            };
          } else {
            sendJsonResponse(res , 404 , {"message" : "No reviews"}) ;
          }
        }
      })
  } else {
    sendJsonResponse(res , 404 , {"message" : "locationid is not found"}) ;
  }
};

// Delete a review
module.exports.reviewsDeleteOne = function(req , res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select('reviews rating')
      .exec(function(err , location){
        if(err){
          sendJsonResponse(res , 404 , err) ;
        } else if(!location){
          sendJsonResponse(res , 404 , {"message" : "Location is not fount"}) ;
        } else {
          if(location.reviews && location.reviews.length > 0){
            var theReview = location.reviews.id(req.params.reviewid) ;
            if(!theReview){
              sendJsonResponse(res , 404 , {"message" : "The requested review isn't found"}) ;
            }else {
              theReview.remove() ;
              location.save(function(err , location){
                if(err){
                  sendJsonResponse(res , 404 , err) ;
                } else {
                  updateAverageRating(location._id) ;
                  sendJsonResponse(res , 200 , location) ;
                };
              });
            };
          } else {
            sendJsonResponse(res , 404 , {"message" : "No reviews"}) ;
          };
        };
      });
  } else {
    sendJsonResponse(res , 404 , {"message" : "locationid is not found"}) ;
  };
};
