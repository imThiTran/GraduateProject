var express= require('express');
var router=express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');

var fs=require('fs');

//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replaceAll(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{     
    Film.find({},(err,fi)=>{
        Showtime.find({},(err,st)=>{
            st.forEach(function(s){
               s.shortId=s._id.toString().slice(17);
               fi.forEach(function(f){
                   if (s.idFilm==f._id.toString()){
                       s.nameEN=f.nameEN;
                   }
               }) 
            })
            res.render('admin/admin-showtime',{
                showtimes:st, 
                films:fi           
                });
            })
        })
    })

function transferTimeEnd(timeStart,time){
    var hourAdd=Math.floor(time/60);
    var minuteAdd=time%60;
    var ArrTimeStart=timeStart.split(':');
    var newHour=parseInt(ArrTimeStart[0])+hourAdd;
    var newMinute=parseInt(ArrTimeStart[1])+minuteAdd;
    if (newMinute>=60) {
        newMinute=newMinute-60;
        newHour=newHour+1;
    }
    return ((newHour<10)?('0'+newHour):newHour)+':'+((newMinute<10)?('0'+newMinute):newMinute);
}

router.post('/add-showtime',(req,res)=>{
    const {date,idAndTime,timeStart,room} = req.body;
    var idAndTimeArr=idAndTime.split('/');
    var idFilm=idAndTimeArr[0];
    var time=idAndTimeArr[1];
    if (typeof room=="string"){
        var timeEnd=transferTimeEnd(timeStart,time);
        var timeEndReal=transferTimeEnd(timeEnd,"30");
    }else {
        var check=true;
        var timeEnd=[];
        var timeEndReal=[];
        timeStart.forEach(function(timeStart){
            var newTimeEnd=transferTimeEnd(timeStart,time);
            timeEnd.push(newTimeEnd);
            timeEndReal.push(transferTimeEnd(newTimeEnd,"30"));
        })
        for (var i=0;i<timeStart.length;i++)
            for (var j=i+1;j<timeStart.length;j++){
                if(room[i]==room[j]){
                    if ((timeStart[j]<timeStart[i] && timeStart[i]<timeEndReal[j]) 
                    ||  (timeStart[j]<timeEndReal[i] && timeEndReal[i]<timeEndReal[j]))
                    check=false;
                }    
        } 
        if (check==false){
            res.send("Thời gian giữa các suất chiếu trùng nhau");
        } else {
            res.send("Ổn rồi đó");
        }
    }
    
})

module.exports= router;