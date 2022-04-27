var express= require('express');
var router=express.Router();
var Event = require('../models/event')
var User = require('../models/user');
var Voucher = require('../models/voucher')
var cloudinary = require('cloudinary').v2;
var fs = require('fs');
//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replace(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{
    res.render('admin/admin-event')
})

router.post('/add',(req,res)=>{
    var {content,title,type,code,value} = req.body
    var slug = (cleanText(title).replace(/\s/g, '-')).toLowerCase();
    var photoFile;
    if (req.files != null) photoFile=req.files.photo;
    else photoFile="";
    if (photoFile != "") { 
        cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/events/" + slug }, function (err, rsPhoto) {
            if (err) throw err;
            fs.unlink(photoFile.tempFilePath, function (err) {
                if (err) throw err;
            })
            User.findOne({email:req.session.user},function(err,user){
                var event = new Event({
                    title:title,
                    slug:slug,
                    content:content,
                    photo: rsPhoto.url,
                    photoDrop: rsPhoto.public_id,
                    author:user.fullname,
                    type:type
                })                
                event.save(function (err) {
                    if (err) throw err;                                                        
                });
                if(type=="Khuyến mãi"){
                    var voucher = new Voucher({
                        code:code,
                        value:value
                    })
                    voucher.save(function (err) {
                        if (err) throw err;                                                        
                    });
                }
            })            
        })
    }    
})

module.exports= router;