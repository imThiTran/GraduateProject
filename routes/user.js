var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');
var Film=require('../models/film');
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
var bcrypt = require('bcrypt');
var shortid=require('shortid');


var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

router.get('/info', (req, res) => {
    if(req.session.user){
        User.findOne({email:req.session.user}, (err,us) => {
            if (err) return console.log(err);
            var newUs=us.email;
            var index=newUs.indexOf('@');
            var newUs1=newUs.slice(0,index-3);
            var newUs2=newUs.slice(index);
            newUs=newUs1.concat('***',newUs2);
            res.render('user/UserInfo',{
                us:us,
                email:newUs,
                cats:cats
            });
        })
    } else {
        res.status(404).render('error',{
            mes:"Page not found"
        })
    }  
})

router.get('/change-info', (req,res) => {
    if(req.session.user){
        User.findOne({email:req.session.user}, (err,us) => {
            if (err) return console.log(err);
            res.render('user/change-info',{
                us:us,
                cats:cats
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
        us.fullname=fullname;
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
    var {content,idFilm}=req.body;
    if (req.session.user){
        Film.findById(idFilm,function(err,fi){
            
            User.findOne({email:req.session.user},function(err,us){
                var obj={
                    idCmt:shortid.generate(),
                    idUser: us._id.toString(),
                    comment:content,
                    date: new Date()
                }
                fi.comments.push(obj);
                fi.save(function(err){
                    res.send('success');
                })
            })
        })
    } else {
        res.send('fail');
    }
    
})

module.exports = router;