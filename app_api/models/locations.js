var mongoose = require('mongoose') ;

var openingTimeSchema = new mongoose.Schema({
  days: {type: String , required: true},
  opening: String,
  closing: String,
  status: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
  reviewRate: {type: Number, required: true, min: 0, max: 5},
  author: {type: String},
  date: {type: String, default: new Date()},
  comment: {type: String, required: true}
});

var locationSchema = new mongoose.Schema({
  name: {type: String , required: true},
  address: String,
  rating: {type: Number, default: 0, min: 0, max: 5},
  facilities: [String],
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location' , locationSchema) ;
