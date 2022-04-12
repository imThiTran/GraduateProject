var User= require('../models/user');

module.exports = function(req,res,next){
    if (typeof req.session.user !="undefined"){
        User.findOne({email:req.session.user},function(err,us){
            if (err) return console.log(err);
            if (us){
                if (us.block.type==0) next();
                else {
                    req.session.destroy();
                    res.redirect('/auth/login');
                }
            }
        })  
    } else {
        next();
    }
    
}