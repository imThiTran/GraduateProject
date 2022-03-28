var express = require('express')
var router = express.Router();

var User= require('../models/user');

var nodemailer = require('nodemailer');

//get login
router.get('/login',function(req,res){
    res.render('auth/login');
})

//post login
router.post('/login',function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    User.findOne({email: email},function(err,user){
        if (err) return console.log(err);
        if (user){
            // if (user.block.type!=0) {
            //     var mes="Tài khoản của bạn bị chặn đến "+user.block.dateto+" vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
            //     if (user.block.type=='non') 
            //     mes="Tài khoản của bạn bị chặn vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
            //     res.render('auth/login',{
            //         value: email,
            //         mes: mes
            //     })
            // } else
             if (user.password== password){
                req.session.user = email; 
                res.redirect('/')
            }
            else {
                res.render('auth/login',{
                    value: email,
                    mes: 'Sai mật khẩu'
                })
            }
        }
        else {
            res.render('auth/login',{
                value:email,
                mes: 'Tài khoản không tôn tại'
            })
        }
    })
   
})

//get forgetPassword
router.get('/forget',function(req,res){
    res.render('auth/forgetPass');
})
module.exports = router;