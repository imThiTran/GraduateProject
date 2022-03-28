var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken')
var User= require('../models/user');

var nodemailer = require('nodemailer');
//server gmail
var transporter =  nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'testdoan124@gmail.com', //Tài khoản gmail
        pass: 'scrucwgckwqloonw' //Mật khẩu tài khoản gmail
    },
    tls: {        
        rejectUnauthorized: false
    }
});

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

//post forgetPW
router.post('/forget',function(req,res){
    const {email} = req.body;
    User.findOne({email: email},function(err,user){
        if(user){
            //Sign token và set token sống 20 phút
            const token = jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY, {expiresIn: '20m'});
            const data = {  
                from: 'testdoan124@gmail.com',
                to: email,
                subject: 'Quên mật khẩu',
                html: `
                    <a href="${process.env.CLIENT_URL}/auth/reset/${token}">Click here to reset PW</a>
                `
            }
            transporter.sendMail(data, function(err, info){
                if (err) {
                    console.log(err);                                      
                } else {
                    console.log('Message sent: ' +  info.response);                   
                }
            });
            user.resetLink=token;
            user.save(function(err){
                if (err) return console.log(err);                        
            })
        }
    })
})
router.get('/reset/:slug',function(req,res){
    res.render('auth/resetPass');
})
router.post('/reset/:slug',function(req,res){
    const token = req.params.slug;
    console.log(token)
    const {newpass} = req.body
    if(token){
        jwt.verify(token, process.env.RESET_PASSWORD_KEY, function(err, decodedData){
            if(err){
                console.log(err);
            }else{
                User.findOne({resetLink: token},function(err,user){
                    if(user){
                        user.password=newpass;
                        user.save(function(err){
                            if (err) return console.log(err);                        
                        })
                    }
                })
            }            
        })
    }
})
module.exports = router;