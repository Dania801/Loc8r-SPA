// Define database connection and open Mongoose connection
var mongoose = require('mongoose') ;
var dbURI = 'mongodb://localhost/Loc8r';
var gracefulShutdown ;
mongoose.connect(dbURI);
require('./locations') ; 

// Listen to Mongoose events and output them
mongoose.connection.on('connected' , function(){
  console.log('Mongoose connected to ' + dbURI) ;
});

mongoose.connection.on('error' , function(err){
  console.log('Mongoose connection error: ' + err) ;
});

mongoose.connection.on('disconnected' , function(){
  console.log('Mongoose disconnected') ;
});

// The reusable function to close Mongoose connection
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// Close mongoose connection when nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Close mongoose connection when app terminates
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

// Close mongoose connection when Heroku app shutdown
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});
