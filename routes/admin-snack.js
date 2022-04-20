var express = require('express');
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Ticket = require('../models/ticket');
var shortId = require('shortid');
const Room = require('../models/room');
const TicketPrice = require('../models/ticket-price');

router.get('/',(req,res)=>{
    res.render('admin/admin-snack');
})

module.exports = router;