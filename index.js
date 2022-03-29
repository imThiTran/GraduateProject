var express = require('express');
var path= require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config()
var mongoose = require('mongoose');

//connect mongo
mongoose.connect(process.env.DATABASE);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
    console.log('connected to mongodb');
});

//init server
var app = express();
var server = require('http').Server(app);

//set view, template engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//setup public folder
app.use(express.static(path.join(__dirname,'public')));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//parse application/json
app.use(bodyParser.json())

//express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: false,
      maxAge: 1800000
    }
  }));

function daysInMonth(month, year){
    return new Date(year,month,0).getDate();
}
const today = new Date();
const dayinmonth = daysInMonth(today.getMonth()+1,today.getFullYear());                                    
                                
app.get("/",function(req,res){
    res.render('index',{
      dayinmonth:dayinmonth,      
      today:today
    });
})

var port=process.env.PORT || 3000;
server.listen(port,function(){
    console.log('connected to port ' + port);
});

var auth = require('./routes/auth');
var user = require('./routes/user');
app.use('/auth',auth);
app.use('/user',user);

app.use((req, res, next) => {
  res.status(404).render('error',{
    mes:"Page Not Found"
  });
});