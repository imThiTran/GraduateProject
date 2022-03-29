var nodemailer = require('nodemailer');

//server gmail
transporter =  nodemailer.createTransport({ // config mail server
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
module.exports = transporter;