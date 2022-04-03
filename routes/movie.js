var express = require('express');
var router = express.Router();
var Category = require('../models/category')
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var User = require('../models/user');
var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

router.get('/:slug', (req,res) => {
    var {slug} = req.params    
    Film.findOne({slug:slug}, function(err,film){ 
        Category.findById(film.idcat, function(err,cat){
            Showtime.find({idFilm:film._id.toString()},function(err,st){
                var dateSt=[];
                for(var i=0;i<st.length;i++){
                    dateSt.push(st[i].date);
                }
                User.find({},function(err,us){
                    for(var i=0;i<film.comments.length;i++)
                    {
                        for(var j=0;j<us.length;j++)
                        {   
                            if (film.comments[i].idUser==us[j]._id.toString()){
                                film.comments[i].photoUser=us[j].photo;
                                film.comments[i].nameUser=us[j].fullname;
                            }
                        }
                    }
                film.idcat=cat.title;
                res.render('movie/detail-movie',{
                    cats: cats,
                    film: film,
                    dateSts: Array.from(new Set(dateSt))
                        })
                    })
            })
        })
    })    
})

router.get('/category/:slug', (req,res) => {
    var {slug} = req.params
    Category.findOne({slug:slug}, function(err,cat){
        Film.find({idcat:cat._id}, function(err,films){
            res.render('movie/categories',{
                cats: cats,
                films:films
            })
        }) 
    })
       
})

router.post('/load-time',(req,res)=>{
    var {date,idFilm}=req.body;
    if (date!='none'){
        var hmtlSend='';
    Showtime.find({date:date,idFilm:idFilm},(err,sts)=>{
        sts.forEach(function(st){
            var newSt=st.timeStart.split(':');
            hmtlSend=hmtlSend+`<div class="time-btn">
            <input type="radio" class="btn-check" id="btn-check1" name="options"
                autocomplete="off">
            <label class="btn btn-outline-warning btn-time" for="btn-check1">`+st.timeStart+((newSt[0]<12)?` AM`:` PM`)+ `
                </label>
        </div>`
        })
        res.send(hmtlSend);
        })
    }else {
        res.send('');
    }
    
})

module.exports = router;