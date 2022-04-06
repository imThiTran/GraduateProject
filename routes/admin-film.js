var express= require('express');
var router=express.Router();
var Film = require('../models/film');
var cloudinary = require('cloudinary').v2;
var Category = require('../models/category');
var fs=require('fs');

//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replaceAll(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{               
    Category.find({},(err,cats)=>{
        Film.find({},(err,films)=>{    
            films.forEach((film) => {
                cats.forEach((cat) => {
                    if(film.idCat==cat._id){
                        film.idCat=cat.title      
                    }
                })
            })
            res.render('admin/admin-film',{
                films:films,
                cats:cats
            });        
        })        
    })
})

router.post('/add-film',(req,res)=>{
    var {nameEN,nameVN,directors,cast,premiere,time,detail,trailer,idCat,ageLimit} = req.body;
    var idTrailer = trailer.split('/');
    trailer=idTrailer[idTrailer.length-1];
    var slug=(cleanText(nameVN).replaceAll(' ','-')).toLowerCase();
    var photoFile,backgroundFile;
    if (req.files!=null){
        if (typeof req.files.photo != "undefined") photoFile=req.files.photo;
        else photoFile="";
        if (typeof req.files.background != "undefined") backgroundFile=req.files.background;
        else backgroundFile="";
    } else {
        photoFile="";
        backgroundFile="";
    }
    if (photoFile != "" && backgroundFile!=""){
            cloudinary.uploader.upload(photoFile.tempFilePath,{folder:"cinema/films/"+nameEN},function(err,rsPhoto){
                cloudinary.uploader.upload(backgroundFile.tempFilePath,{folder:"cinema/films/"+nameEN},function(err,rsBackground){
                if (err) throw err;
                fs.unlink(photoFile.tempFilePath,function(err){
                    fs.unlink(backgroundFile.tempFilePath,function(err){                  
                    if (err) throw err;
                    })
                })
                var film=new Film({
                    nameEN:cleanText(nameEN),
                    nameVN:cleanText(nameVN),
                    directors:cleanText(directors),
                    cast:cleanText(cast),
                    premiere:premiere,
                    slug:slug,
                    time:time,
                    detail:cleanText(detail),
                    trailer:cleanText(trailer),
                    idCat:idCat,
                    ageLimit:ageLimit,
                    photo:rsPhoto.url,
                    photoDrop:rsPhoto.public_id,
                    background:rsBackground.url,
                    backgroundDrop:rsBackground.public_id,
                })
                film.save(function(err){
                    if (err) throw err;
                    res.redirect('back');
                });
            })
        })
    } 
})
module.exports= router;