var express = require('express');
var router = express.Router();
var Category = require('../models/category')
var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

router.get('/:slug', (req,res) => {
    res.render('movie/detail-movie',{
        cats: cats
    })
})

router.get('/category/:slug', (req,res) => {
    res.render('movie/categories',{
        cats: cats
    })
})


module.exports = router;