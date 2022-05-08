var express = require('express');
var router = express.Router();
var Category = require('../models/category');
const film = require('../models/film');
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var User = require('../models/user');
var cats = []
var films=[]
Category.find({}, function (err, categories) {
    cats = categories
})
Film.find({}, function (err, fis) {
    films = fis
})

function roundHalf(num) {
    return Math.round(num * 2) / 2;
}

router.get('/:slug', (req, res) => {
    var { slug } = req.params;
    var today = (new Date()).toLocaleDateString('en-CA');
    Film.findOne({ slug: slug }, function (err, film) {
        var checkRating = false; //check user rating one more time
        var sumRate = 0;
        if (film.ratings.length != 0) {
            film.ratings.forEach(function (rateFe) {
                sumRate = sumRate + rateFe.rating;
            })
            film.avgRate = roundHalf(sumRate / (film.ratings.length));
        } else {
            film.avgRate = 0;
        }
        Showtime.find({ idFilm: film._id.toString(), date: { $gte: today },closed:0 }, function (err, st) {
            var dateSt = [];
            for (var i = 0; i < st.length; i++) {
                dateSt.push(st[i].date);
            }
            User.find({}, function (err, us) {
                for (var i = 0; i < film.ratings.length; i++) {
                    for (var j = 0; j < us.length; j++) {
                        if (film.ratings[i].idUser == us[j]._id.toString()) {
                            if (req.session.user) {
                                if (us[j].email == req.session.user) checkRating = true;
                            }
                            film.ratings[i].photoUser = us[j].photo;
                            film.ratings[i].nameUser = us[j].fullname;
                        }
                    }
                }
                let cate = []
                for (var i = 0; i < film.idCat.length; i++) {
                    for (var j = 0; j < cats.length; j++) {
                        if (film.idCat[i] == cats[j]._id) {
                            cate.push(cats[j].title)
                        }
                    }
                }
                film.idCat = cate.join(', ');
                res.render('movie/detail-movie', {
                    cats: cats,
                    film: film,
                    dateSts: Array.from(new Set(dateSt)),
                    checkRating: checkRating,
                    filmArrs:films
                })
            })
        })
    })
})

router.get('/category/:slug', (req, res) => {
    var { slug } = req.params
    var fis = [];
    var avgRates=[];
    Category.findOne({ slug: slug }, function (err, cat) {
        Film.find({}, function (err, films) {
            films.forEach((film) => {
                if (film.idCat.includes(cat._id)) {
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
                    fis.push(film)
                }
            })
            res.render('movie/categories', {
                cats: cats,
                films: fis,
                avgRates:avgRates,
                type: cat.title,
                filmArrs:films
            })
        })
    })
})

router.post('/search-rating/:title',(req,res)=>{
    var value=req.body.value;
    var title=req.params.title;
    value=parseFloat(value);
    var { slug } = req.params
    var fis = [];
    var avgRates=[];
    Category.findOne({title: title }, function (err, cat) {
        Film.find({}, function (err, films) {
            films.forEach((film) => {
                if (film.idCat.includes(cat._id)) {
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
                    if (avgRate>=value){
                        avgRates.push(avgRate);
                        fis.push(film)
                    }
                }
            })
            res.send({
                films: fis,
                avgRates:avgRates,
            })
        })
    })
})

router.post('/load-time', (req, res) => {
    var { date, idFilm } = req.body;
    if (date != 'none') {
        var hmtlSend = '';
        Showtime.find({ date: date, idFilm: idFilm,closed:0 }).sort({ timeStart: 1 }).exec((err, sts) => {
            var i = 1;
            if (sts.length>0){
                sts.forEach(function (st) {
                    var newSt = st.timeStart.split(':');
                        hmtlSend = hmtlSend + `<div class="time-btn">
                <input type="radio" class="btn-check" idSt=${st._id}  onclick="handleRadio(this);" id="btn-check${i}" name="timeStart"
                    autocomplete="off">
                <label class="btn btn-outline-warning btn-time" for="btn-check${i}">${st.timeStart + ((newSt[0] < 12) ? ` AM` : ` PM`)}
                    </label>
            </div>`
                        i++;
                })
            } else {
                hmtlSend='Suất chiếu trong ngày đã hết';
            }
            res.send(hmtlSend);
        })
    } else {
        res.send('');
    }

})

module.exports = router;