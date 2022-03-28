var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken')
var User= require('../models/user');
var bcrypt = require('bcrypt');

var nodemailer = require('nodemailer');
//server gmail
var transporter =  nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL, //Tài khoản gmail
        pass: process.env.PASS_GMAIL //Mật khẩu tài khoản gmail
    },
    tls: {        
        rejectUnauthorized: false
    }
});

//get register
router.get('/register',(req,res) => {
    res.render('auth/register',{
        mes: '',
        email:'',
        fullname:'',
        phone:'',
        birthday:'',
    });
})

//post register
router.post('/register',(req,res) => {
    const {email,fullname,phone,birthday,gender,password} = req.body;
    User.findOne({email: email},function(err,user){
        if(err) return console.log(err);
        if (user) {
            res.render('auth/register',{
                mes: 'Email đã tồn tại',
                email:email,
                fullname:fullname,
                phone:phone,
                birthday:birthday
            })
        }
        else{
            bcrypt.hash(password,10,function(err,hash){
                if (err) return console.log(err);
                var user=new User({
                    email:email,
                    password:hash,
                    fullname:fullname,
                    phone:phone,
                    birthday:birthday,
                    gender:gender
                });
                user.save(function(err){
                    if (err) return console.log(err); 
                    res.render('auth/register',{
                        mes:'Đăng ký thành công',
                        email:'',
                        fullname:'',
                        phone:'',
                        birthday:'',
                    })
                })
            })    
        }
    })
    
})

//confirm register
router.get('/confirm-register/:token',(req,res) => {

})
//get login
router.get('/login',(req,res) => {
    res.render('auth/login');
})

//post login
router.post('/login',(req,res) => {
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
            bcrypt.compare(password,user.password,(err,result) => {
                if (err) return console.log(err);
                if (result){
                req.session.user = email; 
                res.redirect('/')
            }
                else {
                    res.render('auth/login',{
                        value: email,
                        mes: 'Sai mật khẩu'
                    })
                }
            })   
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
router.get('/forget',(req,res) => {
    res.render('auth/forgetPass',{
        mes:''
    });
})

//post forgetPW
router.post('/forget',(req,res) => {
    const {email} = req.body;
    User.findOne({email: email},function(err,user){
        if(user){
            //Sign token và set token sống 20 phút
            const token = jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY+user.password, {expiresIn: '15m'});
            const data = {  
                from: 'testdoan124@gmail.com',
                to: email,
                subject: 'Quên mật khẩu',
                html: `
                    <div>
                    <h1>Đường dẫn này chỉ có thời hạn trong 15 phút, và sau khi reset password thì đường dẫn này sẽ không thể truy cập</h1>
                    </div>
                    <a href="${process.env.CLIENT_URL}/auth/reset/${user._id}/${token}">Click here to reset PW</a>
                `
            }
            transporter.sendMail(data, function(err, info){
                if (err) {
                    console.log(err);
                    res.render('auth/forgetPass',{
                        mes:'Gửi thất bại'
                    });                                              
                } else {
                    console.log('Message sent: ' +  info.response);        
                    res.render('auth/forgetPass',{
                        mes:'Đã gửi link rest password đến mail'
                    });           
                }
            });  
        }
    })
})
router.get('/reset/:id/:token',(req,res) => {
    const {token,id} = req.params;
    User.findById(id,(err,us) => {
        jwt.verify(token, process.env.RESET_PASSWORD_KEY+us.password, function(err, decodedData){
            if (decodedData){
                res.render('auth/resetPass',{
                    mes:''
                });
            } else {
                res.render('error',{
                    mes:'Bạn không có quyền truy cập'
                });
            }
        })
    })
})
router.post('/reset/:id/:token',(req,res) => {
    const {token,id} = req.params;
    const {newpass} = req.body;
    User.findOne({_id: id},function(err,us){
        jwt.verify(token, process.env.RESET_PASSWORD_KEY+us.password, function(err, decoded){
            if(err) return console.log(err); 
                if (decoded){
                    if(us){
                        bcrypt.hash(newpass,10,function(err,hash){
                            us.password=hash;
                            us.save(function(err){
                            if (err) return console.log(err);      
                            res.render('auth/resetPass',{
                                mes:'Đặt lại mật khẩu thành công'
                                });                  
                            })
                        })
                    }
            } else {
                res.render('error',{
                    mes:'Bạn không có quyền truy cập'
                });
            }            
        })
    })
})

module.exports = router;