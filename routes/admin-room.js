var express= require('express');
var router=express.Router();
var fs=require('fs');
const Room = require('../models/room');
const Showtime = require('../models/showtime');
const Ticket = require('../models/ticket');

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
        name:cleanText(name),
        type:type
    })
    room.save(function(err){
        res.send('success');
    })
})

router.get('/delete-room/:id',(req,res)=>{
    var id=req.params.id;
    Showtime.find({idRoom:id},(err,st)=>{
        var idShowtimes= (st.map(s=>s._id.toString()));
        Ticket.deleteMany({idShowtime:{$in:idShowtimes}}, (err) =>{
            Showtime.deleteMany({idRoom:id},()=>{
                Room.findByIdAndRemove(id,function(err){
                    if (err) return console.log(err);
                    res.redirect('back');
                })
            });
        });
    })
})

router.get('/search-room',(req,res)=>{
    var nameRoom=req.query.nameRoom;
    Room.find({name:{$regex:nameRoom,$options:"$i"}}, function(err,ro){
        res.render('admin/admin-room',{
            rooms:ro
        });
    })
})

module.exports= router;