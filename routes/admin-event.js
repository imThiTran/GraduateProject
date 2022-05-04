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
    var check=true
    code=code.toUpperCase()    
    datefrom+=" 00:00:00" 
    dateto+=" 23:59:59"
    var slug = (cleanText(title).replace(/\s/g, '-')).toLowerCase();
    slug=slug.replace('/','-')    
    var photoFile;
    if (req.files != null) photoFile=req.files.photo;
    else photoFile="";
    Event.findOne({slug:slug},(err,ev) => {
        if(ev){
            check=false
            res.send({
                add:false,
                msg:"Sự kiện đã tồn tại"
            })            
        }else if(type=="Khuyến mãi"){
            Voucher.findOne({code:code},(err,vc)=> {
                if(vc){
                    check=false
                    res.send({
                        add:false,
                        msg:"Mã khuyến mãi đã tồn tại"
                    })
                }
            })
        }
        if(check){
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
                                    dateto:new Date(dateto),
                                    current:new Date().getDate()
                                })
                                voucher.save(function (err) {
                                    if (err) throw err;                            
                                });
                            } 
                            res.send({
                                add:true,
                                ev:ev
                            })                                                   
                        });
                        
                    })            
                })
            }
        }
    })
})

router.get('/:slug', (req, res) => {
    var { slug } = req.params
    Event.findOne({slug:slug}, (err, event) => {
        Voucher.findOne({idEvent:event._id}, (err, voucher) => {
            res.send({
                event: event,
                voucher:voucher
            })
        })        
    })
})

router.get('/delete/:slug', (req, res) => {
    var { slug } = req.params
    Event.findOneAndRemove({slug:slug}, (err1, event) => {
        Voucher.findOneAndRemove({idEvent:event._id}, (err2, vc) => {
            if (err1) {
                res.send({
                    msg: "Xóa thất bại",                
                    delete:false
                })
            }else{                
                res.send({
                    msg: "Xóa thành công",
                    slug: slug,
                    delete:true
                })                
            }
        })
    })
})

router.post('/edit/:id', (req, res) => {
    var {content,title,value,datefrom,dateto,pimg} = req.body    
    datefrom+=" 00:00:00" 
    dateto+=" 23:59:59"
    var oldslug=''
    var { id } = req.params   
    var slug = (cleanText(title).replaceAll(' ', '-')).toLowerCase();
    slug=slug.replace('/','-')
    var photoFile; 
    if (req.files != null) {
        if (typeof req.files.photo != "undefined") photoFile = req.files.photo;
        else photoFile = "";       
    } else {
        photoFile = "";       
    }
    Event.findById(id,(err,ev) => {         
        oldslug=ev.slug
        Event.findOne({$and:[{slug:slug},{slug: {'$ne':ev.slug}}]}, function(err,eventt){            
            if(eventt){                
                res.send({
                    msg: "Sự kiện đã tồn tại",
                    edit:false
                })                
            }else{                
                if (photoFile != "") {                     
                    cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/events/" + slug }, function (err, rsPhoto) {
                        if (err) console.log(err) ;
                        fs.unlink(photoFile.tempFilePath, function (err) {
                            if (err) throw err;
                        })                                  
                        ev.content=content
                        ev.title=title
                        ev.slug=slug
                        ev.photo=rsPhoto.url
                        ev.photoDrop=rsPhoto.public_id
                        ev.save(function (err,evt) {
                            if(ev.type=="Khuyến mãi"){
                                Voucher.findOne({idEvent:ev._id},(err,vouch) => {                                    
                                    vouch.value=value,                            
                                    vouch.datefrom=new Date(datefrom)
                                    vouch.dateto=new Date(dateto)
                                    vouch.save({},(err,vc)=>{                                                                          
                                    })
                                })
                            }
                            res.send({
                                ev:ev,
                                edit:true,
                                oldslug:oldslug
                            })
                        })                                                       
                    })
                    if (pimg!=""){
                        cloudinary.uploader.destroy(pimg,function(err,rs){
                            if (err) throw err;
                        })
                    }
                }else{                    
                    ev.content=content
                    ev.title=title
                    ev.slug=slug                
                    ev.save(function (err,evt) {
                        if(ev.type=="Khuyến mãi"){
                            Voucher.findOne({idEvent:ev._id},(err,vouch) => {                                
                                vouch.value=value,                            
                                vouch.datefrom=new Date(datefrom)
                                vouch.dateto=new Date(dateto)
                                vouch.save({},(err,vc)=>{                                                                    
                                })
                            })
                        }                                              
                        res.send({
                            ev:ev,
                            edit:true,
                            oldslug:oldslug
                        })                         
                    })
                }
            }
        }) 
    })      
})
module.exports= router;