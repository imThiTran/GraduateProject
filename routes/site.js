var express = require('express');
var router = express.Router();
var User = require('../models/user');


router.get("/",function(req,res){
    var today=new Date();
    var timeDay = today.getTime();
    var daylength=24*60*60*1000;
    var dayArr=[today];
      for (var i=1;i<7;i++){
        timeDay=timeDay+daylength;
        var nextday = new Date(timeDay);
        dayArr.push(nextday);
      }
    res.render('index',{
      dayArrs:dayArr,      
    });
  })


module.exports = router;