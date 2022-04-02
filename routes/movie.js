var express = require('express');
var router = express.Router();
var Category = require('../models/category')
var Film = require('../models/film')
var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

router.get('/:slug', (req,res) => {
    var {slug} = req.params    
    Film.findOne({slug:slug}, function(err,film){ 
        Category.findById(film.idcat, function(err,cat){
            film.idcat=cat.title
            res.render('movie/detail-movie',{
                cats: cats,
                film: film
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


module.exports = router;