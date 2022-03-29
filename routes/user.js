var express = require('express');
var router = express.Router();
var User = require('../models/user');
var fs = require('fs');
var cloudinary = require('cloudinary').v2;

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
    User.findOne({email: req.session.user},function(err,us){
        if (err) return console.log(err);
        us.fullname=fullname;
        us.gender=gender;
        us.birthday=birthday;
        us.phone=phone
        us.save();
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
                res.redirect('back');
        }
    })
})

module.exports = router;