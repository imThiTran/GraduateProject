var User= require('../models/user');

module.exports = function(req,res,next){
    User.findOne({email:req.session.user},function(err,us){
        if (err) return console.log(err);
        if (us){
            if (us.actor!='staff') next();
            else res.render('error',{
                mes:'Bạn không có quyền truy cập'
            });
        }
    })  
}