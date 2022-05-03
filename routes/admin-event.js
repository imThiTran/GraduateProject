var express= require('express');
var router=express.Router();
var Event = require('../models/event')
var User = require('../models/user');
var Voucher = require('../models/voucher')
var Event = require('../models/event')
var cloudinary = require('cloudinary').v2;
var fs = require('fs');
//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replace(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{
    Event.find({}, function(err,events){
        res.render('admin/admin-event',{
            events:events
        })
    })    
})

router.post('/add',(req,res)=>{
    var {content,title,type,code,value,datefrom,dateto} = req.body   
    datefrom=datefrom.replace("-","/")
    dateto=datefrom.replace("-","/")     
    var slug = (cleanText(title).replace(/\s/g, '-')).toLowerCase();
    slug=slug.replace('/','-')
    return
    var photoFile;
    if (req.files != null) photoFile=req.files.photo;
    else photoFile="";
    if (photoFile != "") { 
        cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/events/" + slug }, function (err, rsPhoto) {
            if (err) console.log(err) ;
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
                event.save(function (err,ev) {
                    if(type=="Khuyến mãi"){
                        var voucher = new Voucher({
                            code:code,
                            value:value,
                            idEvent:ev._id,
                            datefrom:new Date(datefrom),
                            dateto:new Date(dateto+" 23:59:59"),
                            current:new Date().getDate()
                        })
                        voucher.save(function (err) {
                            if (err) throw err;                                                        
                        });
                    }                                                       
                });
                
            })            
        })
    }    
})

module.exports= router;