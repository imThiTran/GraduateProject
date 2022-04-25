var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Film = require('../models/film');
var Showtime = require('../models/showtime');

var Category = require('../models/category');
var fi=[];
Film.find({},(err,films)=>{
  fi=films;
})

router.get("/",function(req,res){
  Category.find({},async function(err,cats){
      var today=new Date();
      var timeDay = today.getTime();
      var todayStr=(today.getFullYear())+'-'+
      (((today.getMonth()+1)<10)?('0'+(today.getMonth()+1)):(today.getMonth()+1))+'-'+
      ((today.getDate()<10)?('0'+today.getDate()):(today.getDate()));
      var daylength=24*60*60*1000;
      var dayArr=[today];
          for (var i=1;i<7;i++){
              timeDay=timeDay+daylength;
              var nextday = new Date(timeDay);
              dayArr.push(nextday);
          }
      const st = await Showtime.find({date:todayStr,closed:0});
          for (var i=0;i<fi.length;i++){
            fi[i].stArr=[]
          }
      const fiSkc = await Film.find({status:'Sắp khởi chiếu'});
          for (var i=0;i<fi.length;i++){
            for (var j=0;j<st.length;j++){
              if (fi[i]._id.toString()== st[j].idFilm){
                fi[i].stArr.push({
                  timeStart:st[j].timeStart,
                  idSt:st[j]._id,
                  closed:st[j].closed
                });
              } 
            }
          }
            res.render('index',{
              dayArrs:dayArr,
              cats: cats,
              filmArrs:fi,
              filmSkcs:fiSkc
      });
  })
})

router.get('/render/:time',async (req,res)=>{
  var time=parseInt(req.params.time);
  var today=new Date(time);
  var todayStr= (today.getFullYear())+'-'+
  (((today.getMonth()+1)<10)?('0'+(today.getMonth()+1)):(today.getMonth()+1))+'-'+
  ((today.getDate()<10)?('0'+today.getDate()):(today.getDate()));
      const st = await Showtime.find({date:todayStr,closed:0});
          for (var i=0;i<fi.length;i++){
              fi[i].stArr=[];
          }
          for (var i=0;i<fi.length;i++){
            for (var j=0;j<st.length;j++){
              if (fi[i]._id.toString()== st[j].idFilm){
                fi[i].stArr.push({
                  timeStart:st[j].timeStart,
                  idSt:st[j]._id,
                  closed:st[j].closed
                });
              } 
            }
          }
          var hmtlSend=``;
          var check=false;
          fi.forEach(function(film){
              film.stArr.sort(function(a, b){ 
                  if (a.timeStart.toLowerCase() < b.timeStart.toLowerCase()) {return -1;} 
                  if (a.timeStart.toLowerCase() > b.timeStart.toLowerCase()) {return 1;} 
                  return 0; 
              })
            if (film.stArr.length >0){
              check=true;
              hmtlSend=hmtlSend+`<div class="poster-movie-div">
              <div class="flex-title">
                  <a href="/movie/`+film.slug+`">
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
                  <a href="/movie/`+film.slug+`"><img class="poster-movie" src=`+film.photo+`></a>
                  <div class="flex-time-movie">`;
                      film.stArr.forEach(function(st){
                          var newSt=st.timeStart.split(':');
                          if (st.closed==0){
                            hmtlSend=hmtlSend+`<div class="movie-time">
                              <a href="/order?idShowtime=`+st.idSt+`" class="btn-overtime btn btn-outline-warning btn-time">`+st.timeStart+((newSt[0]<12)?` AM`:` PM`)+`</a>
                                  </div>`  
                          } else {
                            hmtlSend=hmtlSend+`<div class="movie-time">
                            <a style="opacity:0.5;" class="btn-overtime btn btn-outline-warning btn-time">`+st.timeStart+((newSt[0]<12)?` AM`:` PM`)+`</a>
                                </div>`  
                          }
                      });
                    hmtlSend=hmtlSend+ `</div>
                    </div>
                </div>`
                  
            };
          });
          if (check==false){hmtlSend=hmtlSend+`<h1>Không có suất chiếu nào trong ngày</h1>`}
          res.send(hmtlSend);
})

router.post('/search-film-ajax',(req,res)=>{
  var name=req.body.name;
  var htmlSend='';
  Film.find({$or:[{nameEN:{$regex:name,$options:"$i"}},{nameVN:{$regex:name,$options:"$i"}}]},(err,fi)=>{
    if (fi.length!=0){
      htmlSend=htmlSend+`<ul class="dropdown-menu">`;
    fi.forEach(function(fiFe){
      htmlSend=htmlSend+`<li><a class="dropdown-item" href="/movie/`+fiFe.slug+`">
      <div class="search-option">
          <div class="img-option">
              <img src="`+fiFe.photo+`" alt="phim1">
          </div>
          <div class="title-option">
              <div class="rating-flex">
                  <h5>`+fiFe.nameEN+`</h5>
                  <img src="/img/cs`+fiFe.ageLimit+`.png" alt="">
              </div>
              <h6>`+fiFe.nameVN+`</h6>
          </div>
      </div>
  </a></li>`
    })
    htmlSend=htmlSend+`</ul>`;
    }
    res.send(htmlSend);
  })
})

function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

router.get('/search-film',(req,res)=>{
  var name=req.query.name;
  var avgRates=[];
    Category.find({}, function(err,cats){
      Film.find({$or:[{nameEN:{$regex:name,$options:"$i"}},{nameVN:{$regex:name,$options:"$i"}}]}, function(err,films){
        films.forEach((film) => {
              var sumRate = 0;
              var avgRate;
              if (film.ratings.length != 0) {
                  film.ratings.forEach(function (rateFe) {
                      sumRate = sumRate + rateFe.rating;
                  })
                  avgRate = roundHalf(sumRate / (film.ratings.length));
              } else {
                  avgRate = 0;
              }
              avgRates.push(avgRate);
      })
          res.render('movie/categories',{
              cats: cats,
              films:films,
              avgRates:avgRates,
              type:'Tìm kiếm phim'
          })
      }) 
  })
})

module.exports = router;