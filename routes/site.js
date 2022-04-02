var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Film = require('../models/film');
var Showtime = require('../models/showtime');

var Category = require('../models/category');
router.get("/",function(req,res){
  Category.find({},async function(err,cats){
      var today=new Date();
      var timeDay = today.getTime();
      var todayStr= ((today.getDate()<10)?('0'+today.getDate()):(today.getDate()))+'/'+
      (((today.getMonth()+1)<10)?('0'+(today.getMonth()+1)):(today.getMonth()+1));
      var daylength=24*60*60*1000;
      var dayArr=[today];
          for (var i=1;i<7;i++){
              timeDay=timeDay+daylength;
              var nextday = new Date(timeDay);
              dayArr.push(nextday);
          }
      var filmArr=[];
      const fi = await Film.find({});
      const st = await Showtime.find({date:todayStr});
          for (var i=0;i<fi.length;i++){
            filmArr.push({
              nameEN:fi[i].nameEN,
              nameVN:fi[i].nameVN,
              ageLimit:fi[i].ageLimit,
              photo:fi[i].photo,
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

router.get('/render/:time',async (req,res)=>{
  var time=parseInt(req.params.time);
  var today=new Date(time);
  var todayStr= ((today.getDate()<10)?('0'+today.getDate()):(today.getDate()))+'/'+
  (((today.getMonth()+1)<10)?('0'+(today.getMonth()+1)):(today.getMonth()+1));
  var filmArr=[];
      const fi = await Film.find({});
      const st = await Showtime.find({date:todayStr});
          for (var i=0;i<fi.length;i++){
              filmArr.push({
              nameEN:fi[i].nameEN,
              nameVN:fi[i].nameVN,
              ageLimit:fi[i].ageLimit,
              photo:fi[i].photo,
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
          var hmtlSend=``;
          var check=false;
          filmArr.forEach(function(film){
            if (film.stArr.length >0){
              check=true;
              hmtlSend=hmtlSend+`<div class="poster-movie-div">
              <div class="flex-title">
                  <a href="#">
                      <div class="flex-cs">
                          <div class="english-title">
                              <div class="h6-poster">
                                  `+film.nameEN+`
                              </div>
                              <div class="cs">
                                  <img class="img-cs" src="/img/cs`+film.ageLimit+`.png">
                              </div>
                          </div>
                          <div class="side-poster">
                              `+film.nameVN+`
                          </div>
                      </div>
                  </a>
              </div>
              <div class="flex-time">
                  <a href="#"><img class="poster-movie" src=`+film.photo+`></a>
                  <div class="flex-time-detail">`;
                      film.stArr.forEach(function(st){
                          hmtlSend=hmtlSend+`<div class="time-btn">
                              <a class="btn-overtime btn btn-outline-warning btn-time">`;
                                  var newSt=st.split(':');
                                  if (newSt[0]<12){ 
                                      hmtlSend=hmtlSend+st+' AM';}
                                   else {
                                    hmtlSend=hmtlSend+st+' PM'
                                  };
                                  hmtlSend=hmtlSend+`</a>
                                  </div>`
                              
                      });
                    hmtlSend=hmtlSend+ `</div>
                    </div>
                </div>`
                  
            };
          });
          if (check==false){hmtlSend=hmtlSend+`<h1>Không có suất chiếu nào trong ngày</h1>`}
            res.send(hmtlSend);
})

module.exports = router;