
module.exports = function(req,res,next){
    if (req.session.user){
        next();
    }
    else {
        res.render('auth/login');
    }
}