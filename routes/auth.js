var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken')
var User = require('../models/user');
var bcrypt = require('bcrypt');
var transporter = require('../config/nodemailer')
var Film = require('../models/film')
//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replace(/\s+/g,' ').trim();
}

//get register
router.get('/register', (req, res) => {
    Film.aggregate([{ $match: {}},{ $sample: { size: 5 } }],function(err,filmslide){
        res.render('auth/register', {        
            email: '',
            fullname: '',
            phone: '',
            birthday: '',
            filmslide:filmslide
        });
    })    
})

//post register
router.post('/register', (req, res) => {
    const { email, fullname, phone, birthday, gender, password,url } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (err) return console.log(err);
        if (user) {
            Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
                res.render('auth/register', {
                    mes: 'Email đã tồn tại',
                    email: email,
                    fullname: fullname,
                    phone: phone,
                    birthday: birthday,
                    filmslide:filmslide
                })
            })            
        }
        else {
            const token = jwt.sign(req.body, process.env.RESET_PASSWORD_KEY, { expiresIn: '15m' });
            const data = {                
                to: email,
                subject: 'XÁC NHẬN ĐĂNG KÝ',
                html: `
                <div style="
                width: 100%;
                border-color: #fdbc3b;
                background-color: #333;
                align-items: center;
                color: #eee;
                padding: 50px 230px;
                ">
                    <img src="https://res.cloudinary.com/dhoovijbu/image/upload/v1648484867/logo_gdjebv.gif"
                    style="width: 100%; max-width: 300px;margin-left: 30px;">
                    <div class="card-body" style="
                    box-shadow: 15px 10px #fdbc3b;
                    width: 18rem;
                    border: 2px solid #fdbc3b;
                    margin-top: 30px;
                    border-radius: 10px;
                    padding: 30px;
                    
                    ">
                        <h4 style="color: #fdbc3b;">Xác nhận đăng ký</h4>
                        <p style="
                            color: #eee;
                            padding-bottom: 20px;
                        ">Đường dẫn này chỉ có thời hạn trong 15 phút</p>
                         <a href="${url}/auth/confirm-register/${token}" 
                         style="
                            background-color:#fdbc3b;
                            padding: 10px;
                            border-radius: 5px;
                            border-color: #fdbc3b;
                            color: #333;
                            text-decoration: none;
                            font-weight: 600;
                         ">Xác nhận đăng ký</a>
                    </div>
                </div>
                    
                `
            }
            Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){            
            transporter.sendMail(data, function (err, info) {
                if (err) {
                    console.log(err);
                    res.render('auth/register',{
                        mes:'Đăng ký thất bại',
                        email: '',
                        fullname: '',
                        phone: '',
                        birthday: '',
                        filmslide:filmslide
                    });                                              
                } else {
                    console.log('Message sent: ' + info.response);
                    res.render('auth/register',{
                        mes:'Vui lòng đăng nhập vào gmail để xác nhận đăng ký',
                        email: '',
                        fullname: '',
                        phone: '',
                        birthday: '',
                        filmslide:filmslide
                    });
                }
            });
            })
        }
    })

})

//confirm register
router.get('/confirm-register/:token',(req,res) => {
    var token = req.params.token;
    jwt.verify(token, process.env.RESET_PASSWORD_KEY, function (err, decodedData) {
        if (decodedData) {
            const { email, fullname, phone, birthday, gender, password } = decodedData;
            User.findOne({email:email},(err,us) => {
                if (us) {
                    res.status(404).render('error', {
                        mes: 'Page Not Found'
                    });
                } else {
                        bcrypt.hash(password, 10, function (err, hash) {
                        if (err) return console.log(err);
                        var user = new User({
                            email: cleanText(email),
                            password: hash,
                            fullname: cleanText(fullname),
                            phone: phone,
                            birthday: birthday,
                            gender: gender
                        });
                        user.save(function(err){
                            if (err) return console.log(err); 
                            req.session.user = user.email;
                            res.render('auth/auth-notify',{
                                mes:'Đăng ký thành công',
                            })
                        })
                    })
                }
            })
        } else {
            res.status(404).render('error', {
                mes: 'Page Not Found'
            });
        }
    })
})

//get login
router.get('/login', (req, res) => {
    if (req.session.user){
        res.redirect('/');
    } else{
        Film.aggregate([{ $match: {}},{ $sample: { size: 5 } }],function(err,filmslide){
            res.render('auth/login',{
                filmslide:filmslide
            });
        })        
    }    
})

//post login
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ email: email }, function (err, user) {
        Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){        
            if (err) return console.log(err);
            if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) return console.log(err);
                        if (result) {
                            if (user.block.type!=0) {
                                var mes;
                                if (user.block.type==-1)  mes="Tài khoản của bạn bị chặn vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
                                else {
                                    var time=user.block.dateto.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12:false }) ;
                                    var date=user.block.dateto.toLocaleDateString('en-GB');
                                    mes="Tài khoản của bạn bị chặn đến "+date+" "+time+" vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
                                }
                                res.render('auth/login',{
                                    value: email,
                                    mes: mes,
                                    filmslide:filmslide
                                })
                            } else{
                                req.session.user = email;
                                if (user.actor=='staff'){
                                    res.redirect('/qrcode/scan-qrcode');
                                }
                                else res.redirect('/')
                            } 
                        }
                        else {
                            res.render('auth/login', {
                                value: email,
                                mes: 'Sai mật khẩu',
                                filmslide:filmslide
                            })
                        }
                    })
            }
            else {
                res.render('auth/login', {
                    value: email,
                    mes: 'Tài khoản không tôn tại',
                    filmslide:filmslide
                })
            }
        })
    })
})

//get forgetPassword
router.get('/forget', (req, res) => {
    Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
        res.render('auth/forgetPass',{
            filmslide:filmslide
        });
    })    
})

//post forgetPW
router.post('/forget', (req, res) => {
    const { email,url } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (user) {
            //Sign token và set token sống 20 phút
            const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY + user.password, { expiresIn: '15m' });
            const data = {                
                to: email,
                subject: 'QUÊN MẬT KHẨU',
                html: `
                <div style="
                width: 100%;
                border-color: #fdbc3b;
                background-color: #333;
                align-items: center;
                color: #eee;
                padding: 50px 230px;
                ">
                    <img src="https://res.cloudinary.com/dhoovijbu/image/upload/v1648484867/logo_gdjebv.gif"
                    style="width: 100%; max-width: 300px;margin-left: 30px;">
                    <div class="card-body" style="
                    box-shadow: 15px 10px #fdbc3b;
                    width: 18rem;
                    border: 2px solid #fdbc3b;
                    margin-top: 30px;
                    border-radius: 10px;
                    padding: 30px;
                    
                    ">
                        <h4 style="color: #fdbc3b;">Reset Password</h4>
                        <p style="
                            color: #eee;
                            padding-bottom: 20px;
                        ">Đường dẫn này chỉ có thời hạn trong 15 phút, và sau khi reset password thì đường dẫn này sẽ không thể truy cập</p>
                         <a href="${url}/auth/reset/${user._id}/${token}" 
                         style="
                            background-color:#fdbc3b;
                            padding: 10px;
                            border-radius: 5px;
                            border-color: #fdbc3b;
                            color: #333;
                            text-decoration: none;
                            font-weight: 600;
                         ">Reset</a>
                    </div>
                </div>
                `
            }
            transporter.sendMail(data, function (err, info) {
                if (err) {
                    console.log(err);
                    Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
                        res.render('auth/forgetPass',{
                            mes:'Gửi thất bại',
                            filmslide:filmslide
                        });
                    })
                                                                  
                } else {
                    console.log('Message sent: ' + info.response);
                    Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
                        res.render('auth/forgetPass', {
                            mes: 'Đã gửi link rest password đến mail',
                            filmslide:filmslide
                        });
                    })                    
                }
            });
        }
    })
})
router.get('/reset/:id/:token', (req, res) => {
    const { token, id } = req.params;
    User.findById(id, (err, us) => {
        Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
            jwt.verify(token, process.env.RESET_PASSWORD_KEY + us.password, function (err, decodedData) {
                if (decodedData) {
                    res.render('auth/resetPass',{
                        filmslide:filmslide
                    });
                } else {
                    res.status(404).render('error', {
                        mes: 'Page Not Found'
                    });
                }
            })
        })        
    })
})
router.post('/reset/:id/:token', (req, res) => {
    const { token, id } = req.params;
    const { newpass } = req.body;
    User.findOne({ _id: id }, function (err, us) {
        Film.aggregate([{ $match: {}},{ $sample: { size: 3 } }],function(err,filmslide){
            jwt.verify(token, process.env.RESET_PASSWORD_KEY + us.password, function (err, decoded) {
                if (err) return console.log(err);
                if (decoded) {
                    if (us) {
                        bcrypt.hash(newpass, 10, function (err, hash) {
                            us.password = hash;
                            us.save(function (err) {
                                if (err) return console.log(err);
                                res.render('auth/resetPass', {
                                    mes: 'Đặt lại mật khẩu thành công',
                                    filmslide:filmslide
                                });
                            })
                        })
                    }
                } else {
                    res.status(404).render('error', {
                        mes: 'Page Not Found'
                    });
                }
            })
        })        
    })
})

router.get('/logout',(req,res) => {
    if (req.session.user){
        req.session.destroy();
        res.redirect('/auth/login');
    }
    else {
        res.status(404).render('error', {
            mes: 'Page Not Found'
        });
    }
})

module.exports = router;