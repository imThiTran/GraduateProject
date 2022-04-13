var express= require('express');
var router=express.Router();
var fs=require('fs');
const Room = require('../models/room');

//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replaceAll(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{
    Room.find({},(err,ro)=>{
        res.render('admin/admin-room',{
            rooms:ro
        });
    })
})

router.post('/add-room',(req,res)=>{
    var {name,type}=req.body;
    type=parseInt(type);
    var room= new Room({
        name:name,
        type:type
    })
    room.save(function(err){
        res.send('success');
    })
})

router.get('/delete-room/:id',(req,res)=>{
    var id=req.params.id;
    Room.findByIdAndRemove(id,function(err,rs){
        if (err) return console.log(err);
        res.redirect('back');
    })
})

module.exports= router;