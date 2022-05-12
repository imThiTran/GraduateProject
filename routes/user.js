var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Film=require('../models/film');
var Showtime = require('../models/showtime')
var Bill = require('../models/bill')
var Room =  require('../models/room')
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
var bcrypt = require('bcrypt');
var shortid=require('shortid');
const bill = require('../models/bill');
const room = require('../models/room');
var QRCode = require('qrcode')
var transporter = require('../config/nodemailer')

//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replace(/\s+/g,' ').trim();
}

var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

function generateDate(date, time) {
    var newDay = new Date(date);
    var timeArr = time.split(':');
    newDay.setHours(timeArr[0], timeArr[1]);
    return newDay;
};

router.get('/info', async (req, res) => {
    var films=await Film.find({});
    if(req.session.user){
        User.findOne({email:req.session.user}, (err,us) => {
            if (err) return console.log(err);
            // var newUs=us.email;
            // var index=newUs.indexOf('@');
            // var newUs1=newUs.slice(0,index-3);
            // var newUs2=newUs.slice(index);
            // newUs=newUs1.concat('***',newUs2);
            res.render('user/UserInfo',{
                us:us,
                cats:cats,
                filmArrs:films
            });
        })
    } else {
        res.status(404).render('error',{
            mes:"Page not found"
        })
    }  
})

router.get('/change-info',async (req,res) => {
    var films=await Film.find({});
    if(req.session.user){
        User.findOne({email:req.session.user}, (err,us) => {
            if (err) return console.log(err);
            res.render('user/change-info',{
                us:us,
                cats:cats,
                filmArrs:films
            });
        })
    } else {
        res.status(404).render('error',{
            mes:"Page not found"
        })
    }  
})

router.post('/change-info', (req,res) =>{
    const {fullname,phone,birthday,gender,pimage} = req.body;
    var imageFile;
    if (req.files != null) imageFile=req.files.image;
    else imageFile="";
    User.findOne({email: req.session.user},(err,us) => {
        if (err) return console.log(err);
        us.fullname=cleanText(fullname);
        us.gender=gender;
        us.birthday=birthday;
        us.phone=phone;
        if (imageFile != ""){
            cloudinary.uploader.upload(imageFile.tempFilePath,{folder:"cinema/users/"+us.email},function(err,rs){
                if (err) throw err;
                us.photo=rs.url;
                us.photodrop=rs.public_id;
                fs.unlink(imageFile.tempFilePath,function(err){
                    if (err) throw err;
                })
                us.save(function(err){
                    if (err) throw err;
                    res.redirect('back');
                });
            })
            if (pimage!=""){
                cloudinary.uploader.destroy(pimage,function(err,rs){
                    if (err) throw err;
                    })
                }
            } else {
                us.save(function(err){
                    res.redirect('back');
                });  
        }
    })
})

router.post('/check-pass',(req,res) => {
    var {email,password}=req.body;
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            bcrypt.compare(password, us.password, (err, result) => {
                if (result){
                    res.send("");
                }
                else res.send("Mật khẩu hiện tại chưa đúng");
            })  
        }
    })
})

router.post('/change-pass/:email',function(req,res){
    var email=req.params.email;
    var {oldpass,newpass}=req.body;
    User.findOne({email:email},function(err,us){
        if (err) return console.log(err);
        if (us){
            bcrypt.compare(oldpass, us.password, (err, result) => {
                if (result){
                    bcrypt.hash(newpass, 10, function (err, hash) {
                    us.password=hash;
                    us.save((err)=> {
                        res.send('Đổi mật khẩu thành công');
                        });
                    })
                } else 
                res.send('Vui lòng nhập lại mật khẩu hiện tại')
            })   
        }
    })
})

router.post('/comment',(req,res)=>{
    var {content,idFilm,rating}=req.body;
    if (req.session.user){
        Film.findById(idFilm,function(err,fi){
            User.findOne({email:req.session.user},function(err,us){
                var obj={
                    idRate:shortid.generate(),
                    idUser: us._id.toString(),
                    content:content.trim(),
                    rating:parseInt(rating),
                    date: new Date(),
                    edited:0,
                }
                fi.ratings.push(obj);
                fi.save(function(err){
                    res.send('success');
                })
            })
        })
    } else {
        res.send('fail');
    }   
})

// router.post('/delete-comment', async(req,res)=>{
//     var {idCmt,idFilm}=req.body;
//     const update= await Film.updateOne(
//             {_id:idFilm},
//             {$pull:{
//                 comments:{idCmt:idCmt}
//                     }
//             },
//             {
//                 safe:true
//             }
//         );
//         if (update.modifiedCount==1){
//             res.send()
//     }
// })

router.post('/edit-comment',async (req,res)=>{
    var {idRate,idFilm,content} = req.body;
    const update= await Film.updateOne(
    {_id:idFilm,"ratings.idRate":idRate},
    {$set:{"ratings.$.content":content.trim(), "ratings.$.date":new Date(),"ratings.$.edited":"1"}}
    );
    if (update.modifiedCount==1){
        res.send()
    }
})

router.get('/purchase', async (req,res)=>{
    var films=await Film.find({});
    User.findOne({email:req.session.user}, (err,us) => {
        Bill.find({$and:[{payment:'1'},{user:us.email}]}, (err,bills) => {         
            if (err) console.log(err);
            var billunuse=[]
            var billused=[]            
            bills=bills.reverse()
            bills.forEach(bill => {                      
                if(bill.checkin=="0" && generateDate(bill.showtime.date, bill.showtime.timeStart).getTime()> (new Date()).getTime()){
                    billunuse.push(bill)                                    
                }else{
                    if(bill.checkin=="0"){
                        bill.check="0"
                    }else{
                        bill.check="1"
                    }
                    billused.push(bill)
                }
            })
            res.render('user/UserPurchase',{
                us:us,
                cats:cats,
                billunuse:billunuse,
                billused:billused,
                filmArrs:films
            })
        })        
    })
})

router.get('/sendqr', (req,res) => {
    var {idbill} =req.query
    Bill.findById(idbill, function(err,bill){
        if(bill && bill.payment=="1"){
            var tk=[]
            bill.ticket.forEach(tiki => {
                tk.push(tiki.name)
            })
            var snack=[]
            bill.snack.forEach(snak => {
                snack.push(snak.name+" (x"+snak.quantity+")")
            })            
            QRCode.toDataURL(`${bill._id}`, function (err, url) { 
                const data = {                  
                    to: bill.user,
                    subject: 'Vé xem phim của MEGAS',
                    attachDataUrls: true,
                    html:`<div style="
                    width: 100%;
                    border-color: #fdbc3b;
                    background-color: #333;
                    align-items: center;
                    color: #eee;
                    padding: 50px 300px;
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
                            <h4 style="color: #fdbc3b;margin: 0px;font-size: 24px;
                            text-align: center;">Cảm ơn bạn đã đặt vé tại MEGAS CINEMA</h4>
                            <div style="text-align: center;">
                                <img style="width: 200px" src="${url}">
                                <div style="color: #eee;">
                                    <span style="width: 100px;font-weight: 600;">Code: </span>
                                    <span style="flex: 4;font-weight: 600;">${bill.code}</span>
                                </div>
                            </div>
                            <div style="font-family: 'Saira Semi Condensed', sans-serif;font-size: 16px;
                            line-height: 1.4;margin-top: 20px;color: #eee;">
                                <div style="display: flex;color: #eee;">
                                    <div style="width: 100px;">Tên phim: </div>
                                    <div style="flex: 4;">${bill.film.nameEN}</div>
                                </div>
                                <div style="display: flex;color: #eee;">
                                    <div style="width: 100px;">Suất chiếu: </div>
                                    <div style="flex: 4;">${bill.showtime.date.split("-").reverse().join("/")}  ${bill.showtime.timeStart}</div>
                                </div>
                                <div style="display: flex;color: #eee;">
                                    <div style="width: 100px;">Rạp: </div>
                                    <div style="flex: 4;">${bill.room}</div>
                                </div>
                                <div style="display: flex;color: #eee;">
                                    <div style="width: 100px;">Ghế: </div>
                                    <div style="flex: 4;">${tk.join(' ,')}</div>
                                </div>
                                ${snack.length!=0 ?
                                `<div style="display: flex;color: #eee;">
                                    <div style="width: 100px;">Combo: </div>    
                                    <div style="width: 395px;margin-left: 43px;">${snack.join(' ,')}</div>
                                </div>`
                                :``}     
                            </div>
                                <div style="font-size: 12px;font-style: italic;color: white;margin-top: 10px;">*Vui lòng đến quầy soát vé 15 phút trước giờ chiếu</div>
                        </div>
                    </div>`
                }
                transporter.sendMail(data, function (err, info) {
                    if (err) {
                        console.log(err);
                        res.send({
                            status:false,
                            msg:"Gửi thất bại."
                        })
                    } else {
                        console.log('Message sent: ' + info.response);  
                        res.send({
                            status:true,
                            msg:"Gửi thành công về email của đơn hàng."
                        })                                                                   
                    }
                });                       
            })            
        }
    })
})
module.exports = router;