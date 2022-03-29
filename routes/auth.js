var express = require('express')
var router = express.Router();
var jwt = require('jsonwebtoken')
var User = require('../models/user');
var bcrypt = require('bcrypt');
var transporter = require('../config/nodemailer')

//get register
router.get('/register', (req, res) => {
    res.render('auth/register', {
        mes: '',
        email: '',
        fullname: '',
        phone: '',
        birthday: '',
    });
})

//post register
router.post('/register', (req, res) => {
    const { email, fullname, phone, birthday, gender, password } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (err) return console.log(err);
        if (user) {
            res.render('auth/register', {
                mes: 'Email đã tồn tại',
                email: email,
                fullname: fullname,
                phone: phone,
                birthday: birthday
            })
        }
        else {
            const token = jwt.sign(req.body, process.env.RESET_PASSWORD_KEY, { expiresIn: '15m' });
            const data = {                
                to: email,
                subject: 'Mã xác nhận',
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
                         <a href="${process.env.CLIENT_URL}/auth/confirm-register/${token}" 
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
            transporter.sendMail(data, function (err, info) {
                if (err) {
                    console.log(err);
                    res.render('auth/register',{
                        mes:'Đăng ký thất bại'
                    });                                              
                } else {
                    console.log('Message sent: ' + info.response);
                    res.render('auth/auth-notify',{
                        mes: 'Vui lòng đăng nhập vào mail để xác nhận đăng ký'
                    });
                }
            });
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
                    res.render('error', {
                        mes: 'Page Not Found'
                    });
                } else {
                        bcrypt.hash(password, 10, function (err, hash) {
                        if (err) return console.log(err);
                        var user = new User({
                            email: email,
                            password: hash,
                            fullname: fullname,
                            phone: phone,
                            birthday: birthday,
                            gender: gender
                        });
                        user.save(function(err){
                            if (err) return console.log(err); 
                            res.render('auth/auth-notify',{
                                mes:'Đăng ký thành công',
                            })
                        })
                    })
                }
            })
        } else {
            res.render('error', {
                mes: 'Page Not Found'
            });
        }
    })
})

//get login
router.get('/login', (req, res) => {
    res.render('auth/login');
})

//post login
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ email: email }, function (err, user) {
        if (err) return console.log(err);
        if (user) {
            // if (user.block.type!=0) {
            //     var mes="Tài khoản của bạn bị chặn đến "+user.block.dateto+" vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
            //     if (user.block.type=='non') 
            //     mes="Tài khoản của bạn bị chặn vì vi phạm chính sách, liên hệ MEGAS để được hỗ trợ";
            //     res.render('auth/login',{
            //         value: email,
            //         mes: mes
            //     })
            // } else
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return console.log(err);
                if (result) {
                    req.session.user = email;
                    res.redirect('/')
                }
                else {
                    res.render('auth/login', {
                        value: email,
                        mes: 'Sai mật khẩu'
                    })
                }
            })
        }
        else {
            res.render('auth/login', {
                value: email,
                mes: 'Tài khoản không tôn tại'
            })
        }
    })
})

//get forgetPassword
router.get('/forget', (req, res) => {
    res.render('auth/forgetPass', {
        mes: ''
    });
})

//post forgetPW
router.post('/forget', (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email }, function (err, user) {
        if (user) {
            //Sign token và set token sống 20 phút
            const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY + user.password, { expiresIn: '15m' });
            const data = {                
                to: email,
                subject: 'Quên mật khẩu',
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
                         <a href="${process.env.CLIENT_URL}/auth/reset/${user._id}/${token}" 
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
                    res.render('auth/forgetPass',{
                        mes:'Gửi thất bại'
                    });                                              
                } else {
                    console.log('Message sent: ' + info.response);
                    res.render('auth/forgetPass', {
                        mes: 'Đã gửi link rest password đến mail'
                    });
                }
            });
        }
    })
})
router.get('/reset/:id/:token', (req, res) => {
    const { token, id } = req.params;
    User.findById(id, (err, us) => {
        jwt.verify(token, process.env.RESET_PASSWORD_KEY + us.password, function (err, decodedData) {
            if (decodedData) {
                res.render('auth/resetPass', {
                    mes: ''
                });
            } else {
                res.render('error', {
                    mes: 'Page Not Found'
                });
            }
        })
    })
})
router.post('/reset/:id/:token', (req, res) => {
    const { token, id } = req.params;
    const { newpass } = req.body;
    User.findOne({ _id: id }, function (err, us) {
        jwt.verify(token, process.env.RESET_PASSWORD_KEY + us.password, function (err, decoded) {
            if (err) return console.log(err);
            if (decoded) {
                if (us) {
                    bcrypt.hash(newpass, 10, function (err, hash) {
                        us.password = hash;
                        us.save(function (err) {
                            if (err) return console.log(err);
                            res.render('auth/resetPass', {
                                mes: 'Đặt lại mật khẩu thành công'
                            });
                        })
                    })
                }
            } else {
                res.render('error', {
                    mes: 'Page Not Found'
                });
            }
        })
    })
})

module.exports = router;