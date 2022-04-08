var express= require('express');
var router=express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Ticket= require('../models/ticket');
var shortId= require('shortid');

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
    time=parseInt(time);
    var hourAdd=Math.floor((time+30)/60);
    var minuteAdd=(time+30)%60;
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
    var today= new Date();
    if (typeof room=="string"){
        var newDay=new Date(date); 
        var timeArr=timeStart.split(':');
        newDay.setHours(timeArr[0],timeArr[1]);
        if (newDay<=today){ //kiem tra suất chiếu có sớm hơn thực tại
            res.send("Không được phép tạo suất chiếu trước giờ hiện tại");
        }
        else {
            var timeEnd=transferTimeEnd(timeStart,time);
            Showtime.findOne({date:date,room:room,$or:[     //kiem tra suat chieu nay da ton tai hay khong
                {timeStart:{$lte:timeStart},timeEnd:{$gte:timeStart}},
                {timeStart:{$lte:timeEnd},timeEnd:{$gte:timeEnd}}
            ]},(err,st)=>{
                if (st)
                {
                    res.send('Tồn tại suất chiếu trùng thời gian');
                } else{
                    var tickets=[]; //du lieu ve add vao db
                    var name;
                    var showtime=new Showtime({
                        date:date,
                        timeStart:timeStart,
                        timeEnd:timeEnd,
                        room:room,
                        idFilm:idFilm
                    })
                    showtime.save(function(err,result){
                        if (err) return console.log(err);
                        for (var i=0;i<=9;i++){
                            switch(i)
                            {
                                case 0:name='A';break;
                                case 1:name='B';break;
                                case 2:name='C';break;
                                case 3:name='D';break;
                                case 4:name='E';break;
                                case 5:name='F';break;
                                case 6:name='G';break;
                                case 7:name='H';break;
                                case 8:name='J';break;
                                case 9:name='K';break;
                                default:'';
                            }
                            for(var j=1;j<=12;j++){
                                if (i!=9){
                                    tickets.push({
                                        idShowtime:result._id,
                                        name:name+j,
                                        price:55000,
                                        sorting:(12*i)+j,
                                    })
                                } else {
                                    if (j==7) break;
                                    tickets.push({
                                        idShowtime:result._id,
                                        name:name+j,
                                        price:120000,
                                        sorting:(12*i)+j,
                                    })
                                }
                            }
                        }
                        Ticket.insertMany(tickets);
                        res.send('success');
                    })
                }
            })
        }
    }else {
        var checkTime=true;
        timeStart.forEach(function(timeStart){
            var newDay=new Date(date); 
            var timeArr=timeStart.split(':');
            newDay.setHours(timeArr[0],timeArr[1]);
            if (newDay<=today) checkTime=false;
        })
        if (checkTime==false){
            res.send("Không được phép tạo suất chiếu trước giờ hiện tại");
        }
        else {
            var check=true; //kiem tra cac suat chieu da them co mau thuan khong
            var timeEnd=[];
            timeStart.forEach(function(timeStart){
                var newTimeEnd=transferTimeEnd(timeStart,time);
                timeEnd.push(newTimeEnd);
            })
            for (var i=0;i<timeStart.length;i++)
                for (var j=i+1;j<timeStart.length;j++){
                    if(room[i]==room[j]){
                        if ((timeStart[j]<timeStart[i] && timeStart[i]<timeEnd[j]) 
                        ||  (timeStart[j]<timeEnd[i] && timeEnd[i]<timeEnd[j]))
                        check=false;
                    }    
            } 
            if (check==false){
                res.send("Thời gian giữa các suất chiếu trùng nhau");
            } else {
                var checkExist=true; // kiem tra suat chieu da ton tai
                Showtime.find({},(err,st)=>{
                    for (var i=0;i<st.length;i++)
                    for (var j=0;j<timeStart.length;j++)
                    {
                        if (st[i].date==date && st[i].room==room[j] && 
                            (
                                (st[i].timeStart<timeStart[j] && st[i].timeEnd>timeStart[j]) || 
                                (st[i].timeStart<timeEnd[j] && st[i].timeEnd>timeEnd[j])
                            )
                        )
                        {checkExist=false; break;}
                    }
                    if (checkExist==false){
                        res.send('Tồn tại suất chiếu trùng thời gian');
                    }else {
                        var tickets=[]; //du lieu ve add vao db
                        var showtimes=[];//du lieu suat chieu add vao db
                        var name;
                        for(var i=0;i<room.length;i++){
                            showtimes.push({
                                date:date,
                                idFilm:idFilm,
                                timeStart:timeStart[i],
                                timeEnd:timeEnd[i],
                                room:room[i],
                            }) 
                        }
                        Showtime.insertMany(showtimes).then(function(result){
                            result.forEach(function(st){
                                for (var i=0;i<=9;i++){
                                    switch(i)
                                    {
                                        case 0:name='A';break;
                                        case 1:name='B';break;
                                        case 2:name='C';break;
                                        case 3:name='D';break;
                                        case 4:name='E';break;
                                        case 5:name='F';break;
                                        case 6:name='G';break;
                                        case 7:name='H';break;
                                        case 8:name='J';break;
                                        case 9:name='K';break;
                                        default:'';
                                    }
                                    for(var j=1;j<=12;j++){
                                        if (i!=9){
                                            tickets.push({
                                                idShowtime:st._id,
                                                name:name+j,
                                                price:55000,
                                                sorting:(12*i)+j,
                                            })
                                        } else {
                                            if (j==7) break;
                                            tickets.push({
                                                idShowtime:st._id,
                                                name:name+j,
                                                price:120000,
                                                sorting:(12*i)+j,
                                            })
                                        }
                                    }
                                }
                            })
                            Ticket.insertMany(tickets);
                            res.send('success');
                        });   
                    }
                })
            }
        }
    }    
})

module.exports= router;