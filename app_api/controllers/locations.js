var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res , status , content){
    res.status(status) ;
    res.json(content) ;
};

// Create a location
module.exports.locationsCreate = function(req , res){
  Loc
    .create({
    name : req.body.name ,
    address : req.body.address,
    facilities : req.body.facilities.split(',') ,
    openingTimes : [{
      days : req.body.days1 ,
      opening: req.body.opening1 ,
      closing: req.body.closing1 ,
      status: req.body.status1
    },{
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      status: req.body.status2
    }]
  }, function(err , location){
    if(err){
      sendJsonResponse(res , 404 , err) ;
    }
    else {
      sendJsonResponse(res , 201 , location) ;
    }
  });
};

module.exports.locationsListByDistance = function(req , res){
  Loc
    .find()
    .exec(function(err , locations){
      if(err){
        sendJsonResponse(res , 404 , err) ;
      } else if (!locations) {
        sendJsonResponse(res , 404 , {"message" : "No locations found"}) ;
      } else {
        sendJsonResponse(res , 200 , locations) ;
      }
    })
};

// Display a location
module.exports.locationsReadOne = function(req , res){
  if (req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec(function(err , location){
        if (!location){
          sendJsonResponse(res , 404 , {"message" : "Location not found"}) ;
          return ;
        }
        else if (err){
          sendJsonResponse(res , 404 , err) ;
          return ;
        }
        sendJsonResponse(res , 200 , location) ;
      })
  }
  else {
    sendJsonResponse(res , 404 , {"message" : "No locationid in request"}) ;
  }
};

// Update location
module.exports.locationsUpdateOne = function(req , res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select('-reviews -rating')
      .exec(function (err , location){
        if(err) {
          sendJsonResponse(res , 404 , err) ;
        }
        else if (!location){
          console.log(req.params.locationid);
          sendJsonResponse(res , 404 , {"message" : "No location found"}) ;
        } else{

          location.name = req.body.name ;
          location.address = req.body.address ;
          location.facilities = req.body.facilities.split(',') ;
          location.openingTimes = [{
            days: req.body.days1 ,
            opening: req.body.opening1 ,
            closing: req.body.closing1 ,
            status: req.body.status1
          },{
            days: req.body.days2 ,
            opening: req.body.opening2 ,
            closing: req.body.closing2 ,
            status: req.body.status2
          }] ;

          location.save(function(err , location){
            if(err){
              sendJsonResponse(res , 404 , {"message" : "The location isn't saved"}) ;
            }else {
              sendJsonResponse(res , 200 , location) ;
            };
          })

        }
      })
  }
  else {
    sendJsonResponse(res , 404 , {"message" : "No locationid is requested"}) ;
  }
};

// Delete location
module.exports.locationsDeleteOne = function(req , res){
  if(req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .select('-reviews -rating')
      .exec(function (err , location){
        if(err) {
          sendJsonResponse(res , 404 , err) ;
        }
        else if (!location){
          console.log(req.params.locationid);
          sendJsonResponse(res , 404 , {"message" : "No location found"}) ;
        } else{

          location.remove() ;

          location.save(function(err , location){
            if(err){
              sendJsonResponse(res , 404 , {"message" : "The location isn't saved"}) ;
            }else {
              sendJsonResponse(res , 200 , location) ;
            };
          })
        }
      })
  }
  else {
    sendJsonResponse(res , 404 , {"message" : "No locationid is requested"}) ;
  }
};
