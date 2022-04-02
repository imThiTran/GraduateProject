var express = require('express');
var router = express.Router();
var Category = require('../models/category')
var Film = require('../models/film');
const user = require('../models/user');
var cats=[]
Category.find({}, function(err,categories){
    cats=categories
})

function isObjectEqual(object1, object2) {
    return object1.value === object2.value;
}

router.get('/:slug', (req,res) => {
    var {slug} = req.params    
    Film.findOne({slug:slug}, function(err,film){ 
        Category.findById(film.idcat, function(err,cat){
            user.find({},function(err,us){
                for(var i=0;i<film.comments.length;i++)
                {
                    for(var j=0;j<us.length;j++)
                    {   
                        if (film.comments[i].emailUser==us[j].email){
                            film.comments[i].photoUser=us[j].photo;
                            film.comments[i].nameUser=us[j].fullname;
                        }
                    }
                }
                    
            film.idcat=cat.title;
            res.render('movie/detail-movie',{
                cats: cats,
                film: film
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


module.exports = router;