module.exports.about = function(req , res){
  res.render('generic-text' , {
    title: "about" ,
    comment : 'Loc8r was created to help people find places to sit down and get a bit of work done. \n Created by Dania Refaie'
  }) ;
};
