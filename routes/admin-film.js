var express = require('express');
var router = express.Router();
var Film = require('../models/film');
var cloudinary = require('cloudinary').v2;
var Category = require('../models/category');
var fs = require('fs');
const { resolveNaptr } = require('dns');

//loai bo khoang trang trong chuoi
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

router.get('/', (req, res) => {
    Category.find({}, (err, cats) => {
        Film.find({}, (err, films) => {
            films.forEach((film) => {
                let cate=[] 
                for(var i=0;i<film.idCat.length;i++){
                    for(var j=0;j<cats.length;j++){                       
                        if(film.idCat[i]==cats[j]._id){
                            cate.push(cats[j].title)
                        }
                    }                                   
                }    
                film.idCat=cate.join(', ');                
            })               
            res.render('admin/admin-film', {
                films: films,
                cats: cats
            });
        })
    })
})

router.get('/:slug', (req, res) => {
    var { slug } = req.params
    Film.findOne({slug:slug}, (err, film) => {
        res.send({
            film: film
        })
    })
})

router.post('/add-film', (req, res) => {
    var { nameEN, nameVN, directors, cast, premiere, time, detail, trailer, idCat, ageLimit, status, imgAdd } = req.body;
    var idTrailer = trailer.split('/');
    trailer = idTrailer[idTrailer.length - 1];
    var slug = (cleanText(nameEN).replace(/\s/g, '-')).toLowerCase();
    slug=slug.replace('/','-')
    Film.findOne({slug:slug}, function(err,film){
        if(film){
            res.send({
                msg: "Phim đã tồn tại",
                add:false
            })
        }else{            
            var photoFile, backgroundFile;
            if (req.files != null) {
                if (typeof req.files.photo != "undefined") photoFile = req.files.photo;
                else photoFile = "";
                if (typeof req.files.background != "undefined") backgroundFile = req.files.background;
                else backgroundFile = "";
            } else {
                photoFile = "";
                backgroundFile = "";                
            }
            if (photoFile != "" && backgroundFile != "") {
                if(typeof idCat == "string"){
                    Category.findById(idCat, function(err,cat){
                        var filmAdd = {
                            nameEN:nameEN,
                            nameVN:nameVN,
                            slug:slug,
                            directors:directors,
                            premiere:premiere,
                            cat:cat.title,
                            status:status   
                        }
                        res.send({
                            msg:"Thêm thành công",
                            imgAdd: imgAdd,
                            filmAdd:filmAdd,
                            add:true
                        })
                    })
                }else{
                    Category.find({}, function(err,cats){
                        var cate=[]
                        for(var i=0;i<idCat.length;i++){
                            for(var j=0;j<cats.length;j++){
                                if(idCat[i]==cats[j]._id){
                                    cate.push(cats[j].title)
                                }
                            }
                        }
                        var filmAdd = {
                            nameEN:nameEN,
                            nameVN:nameVN,
                            slug:slug,
                            directors:directors,
                            premiere:premiere,
                            cat:cate.join(', '),
                            status:status
                        }
                        res.send({
                            msg:"Thêm thành công",
                            imgAdd: imgAdd,
                            filmAdd:filmAdd,
                            add:true
                        })
                    })
                }                          
                cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/films/" + slug }, function (err, rsPhoto) {
                    cloudinary.uploader.upload(backgroundFile.tempFilePath, { folder: "cinema/films/" + slug }, function (err, rsBackground) {
                        if (err) throw err;
                        fs.unlink(photoFile.tempFilePath, function (err) {
                            fs.unlink(backgroundFile.tempFilePath, function (err) {
                                if (err) throw err;
                            })
                        })
                        var film = new Film({
                            nameEN: cleanText(nameEN),
                            nameVN: cleanText(nameVN),
                            directors: cleanText(directors),
                            cast: cleanText(cast),
                            premiere: premiere,
                            slug: slug,
                            time: time,
                            detail: cleanText(detail),
                            trailer: cleanText(trailer),
                            idCat: idCat,
                            status: status,
                            ageLimit: ageLimit,
                            photo: rsPhoto.url,
                            photoDrop: rsPhoto.public_id,
                            background: rsBackground.url,
                            backgroundDrop: rsBackground.public_id,
                        })
                        
                        film.save(function (err) {
                            if (err) throw err;                                                        
                        });
                    })
                })
            }
        }
    })
    
})

router.get('/delete/:slug', (req, res) => {
    var { slug } = req.params
    Film.findOneAndRemove({slug:slug}, (err, film) => {
        if (err) throw err;
        res.send({
            msg: "Xóa thành công",
            slug: slug
        })
    })
})

router.post('/edit', (req, res) => {    
    var { nameEN, nameVN, directors, cast, premiere, time, detail, trailer, idCat, ageLimit, status, avtimg, bgimg, idFilm, imgEdit } = req.body;    
    var idTrailer = trailer.split('/');    
    var oldslug=''
    if(idCat.includes(',')){
        idCat=idCat.split(',')
    }    
    trailer = idTrailer[idTrailer.length - 1];
    var slug = (cleanText(nameEN).replaceAll(' ', '-')).toLowerCase();
    var photoFile, backgroundFile; 
    if (req.files != null) {
        if (typeof req.files.photo != "undefined") photoFile = req.files.photo;
        else photoFile = "";
        if (typeof req.files.background != "undefined") backgroundFile = req.files.background;
        else backgroundFile = "";
    } else {
        photoFile = "";
        backgroundFile = "";
    }
    Film.findById(idFilm, (err, film) => {
        oldslug=film.slug
        Film.findOne({$and:[{slug:slug},{slug: {'$ne':film.slug}}]}, function(err,fi){            
            if(fi){
                res.send({
                    msg: "Phim đã tồn tại",
                    edit:false
                })
            }else{
                if(typeof idCat == "string"){
                    Category.findById(idCat, function(err,cat){
                        var filmEdit = {
                            nameEN:nameEN,
                            nameVN:nameVN,
                            slug:slug,
                            directors:directors,
                            premiere:premiere,
                            cat:cat.title,
                            status:status   
                        }
                        res.send({
                            msg:"Sửa thành công",
                            imgEdit: imgEdit,
                            filmEdit:filmEdit,
                            edit:true,
                            oldslug:oldslug
                        })
                    })
                }else{
                    Category.find({}, function(err,cats){
                        var cate=[]
                        for(var i=0;i<idCat.length;i++){
                            for(var j=0;j<cats.length;j++){
                                if(idCat[i]==cats[j]._id){
                                    cate.push(cats[j].title)
                                }
                            }
                        }
                        var filmEdit = {
                            nameEN:nameEN,
                            nameVN:nameVN,
                            slug:slug,
                            directors:directors,
                            premiere:premiere,
                            cat:cate.join(', '),
                            status:status
                        }
                        res.send({
                            msg:"Sửa thành công",
                            imgEdit: imgEdit,
                            filmEdit:filmEdit,
                            edit:true,
                            oldslug:oldslug
                        })
                    })
                }
                if (err) return console.log(err);
                film.nameEN=cleanText(nameEN);
                film.nameVN=cleanText(nameVN);
                film.directors=cleanText(directors);
                film.cast=cleanText(cast);
                film.premiere=premiere;
                film.slug=slug;
                film.time=time;
                film.detail=cleanText(detail);
                film.trailer=cleanText(trailer);                
                film.idCat=idCat;                
                film.status=status;
                film.ageLimit=ageLimit 
                if (photoFile != "" && backgroundFile != "") {
                    cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/films/" + slug }, function (err, rsPhoto) {
                        cloudinary.uploader.upload(backgroundFile.tempFilePath, { folder: "cinema/films/" + slug }, function (err, rsBackground) {
                            if (err) throw err;
                            film.photo=rsPhoto.url
                            film.photoDrop=rsPhoto.public_id
                            film.background=rsBackground.url
                            film.backgroundDrop=rsBackground.public_id
                            fs.unlink(photoFile.tempFilePath, function (err) {
                                fs.unlink(backgroundFile.tempFilePath, function (err) {
                                    if (err) throw err;
                                })
                            })
                            film.save(function (err) {
                                if (err) throw err;           
                            });
                        })
                    })
                }else if(photoFile!=""){
                    cloudinary.uploader.upload(photoFile.tempFilePath, { folder: "cinema/films/" + nameEN }, function (err, rsPhoto) {
                        if (err) throw err;
                        film.photo=rsPhoto.url                        
                        film.photoDrop=rsPhoto.public_id
                        fs.unlink(photoFile.tempFilePath, function (err) {
                            if (err) throw err;
                        })
                        film.save(function (err) {
                            if (err) throw err;           
                        });                      
                    })
                    if (avtimg!=""){
                        cloudinary.uploader.destroy(avtimg,function(err,rs){
                            if (err) throw err;
                        })
                    }
                }else if(backgroundFile != ""){
                    cloudinary.uploader.upload(backgroundFile.tempFilePath, { folder: "cinema/films/" + nameEN }, function (err, rsBackground) {
                        film.background=rsBackground.url                        
                        film.backgroundDrop=rsBackground.public_id
                        fs.unlink(backgroundFile.tempFilePath, function (err) {
                            if (err) throw err;
                        })
                        film.save(function (err) {
                            if (err) throw err;           
                        });                   
                    })
                    if (bgimg!=""){
                        cloudinary.uploader.destroy(bgimg,function(err,rs){
                            if (err) throw err;
                        })
                    }                    
                }else{
                    film.save(function (err) {
                        if (err) throw err;           
                    }); 
                }
            }
        })
    })
})
module.exports = router;