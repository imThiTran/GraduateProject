var express = require('express');
var path= require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config()
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary').v2;

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

//setup cloudinary
cloudinary.config({ 
  cloud_name: process.env.image_name, 
  api_key: process.env.image_key, 
  api_secret: process.env.image_secret,
  secure: true
});

//express fileupload middleware
app.use(fileUpload({
  useTempFiles:true
}));

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

// function daysInMonth(month, year){
//     return new Date(year,month,0).getDate();
// }
// const dayinmonth = daysInMonth(today.getMonth()+1,today.getFullYear());                                                                

var port=process.env.PORT || 3000;
server.listen(port,function(){
    console.log('connected to port ' + port);
});

var auth = require('./routes/auth');
var user = require('./routes/user');
var movie = require('./routes/movie');
var site = require('./routes/site');
var checkUser = require('./middelwares/checkUser.middleware');
var checkLogin = require('./middelwares/checkLogin.middleware');

app.use('/auth',auth);
app.use('/user',checkUser,user);
app.use('/movie',checkUser,movie);
app.use('/',checkUser,site);


app.use((req, res, next) => {
  res.status(404).render('error',{
    mes:"Page Not Found"
  });
});
