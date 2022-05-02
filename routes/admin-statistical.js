var express= require('express');
const ticket = require('../models/ticket');
var router=express.Router();
var Bill = require('../models/bill')
var Showtime = require('../models/showtime')
var Film = require('../models/film')


function daysInMonth(month, year){
    return new Date(year,month,0).getDate();
}

var sts=[]
Showtime.find({}, function(err,showtimes){
    sts=showtimes
})

var films=[]
Film.find({"status": {"$in" : ['Đang khởi chiếu','Đã chiếu xong']}}, function(err,fis){
    films=fis
})

router.get('/day',(req,res)=> {
    var date = new Date()
    var month = date.getMonth()+1
    var year = date.getFullYear()
    var days = daysInMonth(month,year)
    var datamonth = new Array(days)
    var datamonthfull = new Array(days)
    var tk1=new Array(days)
    var tk2=new Array(days)
    var newbill1 = []
    Bill.find({payment:'1'}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.timebooking.getMonth()+1)==month && (bill.timebooking.getFullYear())==year) newbill1.push(bill)
        });
        for(let i=0;i<datamonth.length;i++){            
            datamonth[i]=0
            datamonthfull[i]=0
            tk1[i]=0
            tk2[i]=0
            newbill1.forEach(bill => {
                if((bill.timebooking.getDate()-1)==i){                    
                    datamonth[i]+=parseInt(bill.total)                   
                    datamonthfull[i]+=parseInt(bill.totalbill)
                    bill.ticket.forEach(ticket => {
                        if(ticket.name.includes('K')){
                            tk2[i]+=1
                        }else{
                            tk1[i]+=1
                        }
                    })
                }
            })
        }
        res.render('admin/admin-statistical-day',{
            datamonth:datamonth,
            datamonthfull:datamonthfull,
            tk1:tk1,
            tk2:tk2,
            days:days,
            month:month,
            year:year
        })
    })
})

router.get('/month',(req,res)=> {
    var date = new Date()    
    var year = date.getFullYear()    
    var datayear = new Array(12)
    var datayearfull = new Array(12)
    var tk1=new Array(12)
    var tk2=new Array(12)
    var newbill1 = []
    Bill.find({payment:'1'}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.timebooking.getFullYear())==year) newbill1.push(bill)
        });
        for(let i=0;i<datayear.length;i++){            
            datayear[i]=0
            datayearfull[i]=0
            tk1[i]=0
            tk2[i]=0
            newbill1.forEach(bill => {
                if((bill.timebooking.getMonth())==i){                    
                    datayear[i]+=parseInt(bill.total)                   
                    datayearfull[i]+=parseInt(bill.totalbill)
                    bill.ticket.forEach(ticket => {
                        if(ticket.name.includes('K')){
                            tk2[i]+=1
                        }else{
                            tk1[i]+=1
                        }
                    })
                }
            })
        }
        res.render('admin/admin-statistical-month',{
            datayear:datayear,
            datayearfull:datayearfull,
            tk1:tk1,
            tk2:tk2,            
            year:year
        })
    })    
})

router.get('/film',(req,res)=> {
    var datafilm = new Array(films.length)
    var datafilmfull = new Array(films.length)
    var tk = new Array(films.length)
    var listnamefilm=[]
    Bill.find({payment:'1'}, function(err,bills){        
        for(let i=0;i<datafilm.length;i++){   
            datafilm[i] =0
            datafilmfull[i]=0
            tk[i]=0
            bills.forEach(bill => {
                sts.forEach(st => {
                    if(bill.ticket[0].idShowtime==st._id&&st.idFilm==films[i]._id){
                        datafilm[i]+=parseInt(bill.total)                 
                        datafilmfull[i]+=parseInt(bill.totalbill)
                                                  
                    }                          
                })
            })
            sts.forEach(st => {
                if(st.idFilm==films[i]._id){
                    tk[i]++
                }
            })
            listnamefilm.push(films[i].nameEN)
        }
        res.render('admin/admin-statistical-film',{
            datafilm:datafilm,
            datafilmfull:datafilmfull,
            tk:tk,
            films:films,
            listnamefilm:listnamefilm
        })    
    })
   
})

router.post('/day',(req,res) =>{
    var year = req.body.getmonth.slice(0,4)
    var month = req.body.getmonth.slice(5,7)
    month=parseInt(month)
    var days = daysInMonth(month,year)
    var datamonth = new Array(days)
    var datamonthfull = new Array(days)
    var tk1=new Array(days)
    var tk2=new Array(days)
    var newbill1 = []
    Bill.find({payment:'1'}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.timebooking.getMonth()+1)==month && (bill.timebooking.getFullYear())==year) newbill1.push(bill)
        });
        for(let i=0;i<datamonth.length;i++){            
            datamonth[i]=0
            datamonthfull[i]=0
            tk1[i]=0
            tk2[i]=0
            newbill1.forEach(bill => {
                if((bill.timebooking.getDate()-1)==i){                    
                    datamonth[i]+=parseInt(bill.total)                   
                    datamonthfull[i]+=parseInt(bill.totalbill)
                    bill.ticket.forEach(ticket => {
                        if(ticket.name.includes('K')){
                            tk2[i]+=1
                        }else{
                            tk1[i]+=1
                        }
                    })
                }
            })
        }
        res.send({
            datamonth:datamonth,
            datamonthfull:datamonthfull,
            tk1:tk1,
            tk2:tk2,
            days:days,
            month:month,
            year:year
        })
    })   
})

router.post('/month',(req,res) =>{
    var year = req.body.getyear
    var datayear = new Array(12)
    var datayearfull = new Array(12)
    var tk1=new Array(12)
    var tk2=new Array(12)
    var newbill1 = []
    Bill.find({payment:'1'}, function(err,bills){
        bills.forEach(bill => {            
            if((bill.timebooking.getFullYear())==year) newbill1.push(bill)
        });
        for(let i=0;i<datayear.length;i++){            
            datayear[i]=0
            datayearfull[i]=0
            tk1[i]=0
            tk2[i]=0
            newbill1.forEach(bill => {
                if((bill.timebooking.getMonth())==i){                    
                    datayear[i]+=parseInt(bill.total)                   
                    datayearfull[i]+=parseInt(bill.totalbill)
                    bill.ticket.forEach(ticket => {
                        if(ticket.name.includes('K')){
                            tk2[i]+=1
                        }else{
                            tk1[i]+=1
                        }
                    })
                }
            })
        }
        res.send({
            datayear:datayear,
            datayearfull:datayearfull,
            tk1:tk1,
            tk2:tk2,            
            year:year
        })
    })   
})
module.exports= router;