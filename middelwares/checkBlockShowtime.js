var Showtime= require('../models/showtime');

module.exports = function(req,res,next){
    Showtime.find({email:req.session.user},function(err,us){
        
    })  
}