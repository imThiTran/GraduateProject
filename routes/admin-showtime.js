var express= require('express');
var router=express.Router();
var Film = require('../models/film');
var Category = require('../models/category');
var fs=require('fs');

//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replaceAll(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{       
    res.render('admin/admin-showtime');
})


module.exports= router;