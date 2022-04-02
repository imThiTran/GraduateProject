var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Film = require('../models/film');
var Showtime = require('../models/showtime');

var Category = require('../models/category');
router.get("/",async function(req,res){
  Category.find({},async function(err,cats){
    var today=new Date();
    var timeDay = today.getTime();
    var daylength=24*60*60*1000;
    var dayArr=[today];
      for (var i=1;i<7;i++){
        timeDay=timeDay+daylength;
        var nextday = new Date(timeDay);
        dayArr.push(nextday);
      }
      var filmArr=[];
      const fi = await Film.find({});
      const st = await Showtime.find({});
        for (var i=0;i<fi.length;i++){
          filmArr.push({
            nameEN:fi[i].nameEN,
            stArr:[]
          })
        }
        for (var i=0;i<fi.length;i++){
          for (var j=0;j<st.length;j++){
            if (fi[i]._id== st[j].idFilm){
              filmArr[i].stArr.push(st[j].timeStart);
            } 
          }
        }
          res.render('index',{
            dayArrs:dayArr,
            cats: cats,
            filmArrs:filmArr
          });
  })
  
})

router.get('/render/:time',(req,res)=>{

})

module.exports = router;