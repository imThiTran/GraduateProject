var express = require('express');
var router = express.Router();
var Category = require('../models/category');
const film = require('../models/film');
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
                    let cate=[] 
                    for(var i=0;i<film.idCat.length;i++){
                        for(var j=0;j<cats.length;j++){                       
                            if(film.idCat[i]==cats[j]._id){
                                cate.push(cats[j].title)
                            }
                        }                                   
                    }    
                    film.idCat=cate.toString()
                    res.render('movie/detail-movie',{
                        cats: cats,
                        film: film,
                        dateSts: Array.from(new Set(dateSt))
                            })
                    })
            })
    })    
})

router.get('/category/:slug', (req,res) => {
    var {slug} = req.params
    var fis=[]
    Category.findOne({slug:slug}, function(err,cat){        
        Film.find({}, function(err,films){
            films.forEach((film) => {
                if(film.idCat.includes(cat._id)){
                    fis.push(film)
                }
            })
            res.render('movie/categories',{
                cats: cats,
                films:fis,
                type:cat.title
            })
        }) 
    })
})

router.post('/load-time',(req,res)=>{
    var {date,idFilm}=req.body;
    if (date!='none'){
        var hmtlSend='';
    Showtime.find({date:date,idFilm:idFilm}).sort({timeStart:1}).exec((err,sts)=>{
        var i=1;
        sts.forEach(function(st){
            var newSt=st.timeStart.split(':');
            hmtlSend=hmtlSend+`<div class="time-btn">
            <input type="radio" class="btn-check" idSt=`+st._id+` onclick="handleRadio(this);" id="btn-check`+i+`" name="timeStart"
                autocomplete="off">
            <label class="btn btn-outline-warning btn-time" for="btn-check`+i+`">`+st.timeStart+((newSt[0]<12)?` AM`:` PM`)+ `
                </label>
        </div>`
        i++;
        })
        res.send(hmtlSend);
        })
    }else {
        res.send('');
    }
    
})

module.exports = router;