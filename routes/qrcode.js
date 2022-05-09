var express = require('express');
var router = express.Router();

var Bill = require('../models/bill');
var Showtime = require('../models/showtime');
var Film = require('../models/film');
var Category = require('../models/category');
var Room = require('../models/room');
const User = require('../models/user');
var cats = []
var films=[]
Category.find({}, function (err, categories) {
    cats = categories
})
Film.find({}, function (err, fis) {
    films = fis
})


function generateDate(date, time) {
    var newDay = new Date(date);
    var timeArr = time.split(':');
    newDay.setHours(timeArr[0], timeArr[1]);
    return newDay;
};

router.post('/scan-bill', (req, res) => {
    var qrcode = req.body.qrcode;
    var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    var date = new Date().toLocaleDateString('en-GB');
    Bill.findById(qrcode, (err, bill) => {
        if (bill) {
            if (bill.checkin == 0) {                
                    var dateSt = generateDate(bill.showtime.date, bill.showtime.timeStart);
                    if ((dateSt.getTime() + 1800000) < (new Date()).getTime()) res.send('Suất chiếu này đã hết hạn');
                    else {                        
                        var tickets = '', snacks = '';
                        var timeStartArr = bill.showtime.timeStart.split(':');
                        bill.showtime.timeStart = bill.showtime.timeStart + ((timeStartArr[0] < 12) ? (' AM') : (' PM'));
                        bill.ticket.forEach(function (tk, index) {
                            if (index == bill.ticket.length - 1) tickets = tickets + tk.name;
                            else tickets = tickets + tk.name + ', '
                        })
                        if (bill.snack.length != 0) {
                            bill.snack.forEach(function (sn, index) {
                                if (index == bill.snack.length - 1) snacks = snacks + sn.quantity + ' x ' + sn.name;
                                else snacks = snacks + sn.quantity + ' x ' + sn.name + ', '
                            })
                        }
                        res.send({
                            id: bill._id,
                            timePrint: date + ' ' + time,
                            fullname: bill.fullname,
                            nameEN: bill.film.nameEN,
                            nameVN: bill.film.nameVN,
                            date: new Date(bill.showtime.date).toLocaleDateString('en-GB'),
                            time: bill.showtime.timeStart,
                            room: bill.room,
                            ticket: tickets,
                            snack: snacks,
                            total: bill.total
                        });                            
                    }                
            }
            else {
                res.send('Bill đã được sử dụng')
            }
        }
        else {
            res.send('Mã QR không hợp lệ')
        }
    })
})

router.post('/code-backup',(req,res)=>{
    var qrcode = req.body.qrcode;
    var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    var date = new Date().toLocaleDateString('en-GB');
    Bill.findOne({code:qrcode}, (err, bill) => {
        if (bill) {
            if (bill.checkin == 0) {                
                    var dateSt = generateDate(bill.showtime.date, bill.showtime.timeStart);
                    if ((dateSt.getTime() + 1800000) < (new Date()).getTime()) res.send('Suất chiếu này đã hết hạn');
                    else {                        
                        var tickets = '', snacks = '';
                        var timeStartArr = bill.showtime.timeStart.split(':');
                        bill.showtime.timeStart = bill.showtime.timeStart + ((timeStartArr[0] < 12) ? (' AM') : (' PM'));
                        bill.ticket.forEach(function (tk, index) {
                            if (index == bill.ticket.length - 1) tickets = tickets + tk.name;
                            else tickets = tickets + tk.name + ', '
                        })
                        if (bill.snack.length != 0) {
                            bill.snack.forEach(function (sn, index) {
                                if (index == bill.snack.length - 1) snacks = snacks + sn.quantity + ' x ' + sn.name;
                                else snacks = snacks + sn.quantity + ' x ' + sn.name + ', '
                            })
                        }
                        res.send({
                            id: bill._id,
                            timePrint: date + ' ' + time,
                            fullname: bill.fullname,
                            nameEN: bill.film.nameEN,
                            nameVN: bill.film.nameVN,
                            date: new Date(bill.showtime.date).toLocaleDateString('en-GB'),
                            time: bill.showtime.timeStart,
                            room: bill.room,
                            ticket: tickets,
                            snack: snacks,
                            total: bill.total
                        });                            
                    }                
            }
            else {
                res.send('Bill đã được sử dụng')
            }
        }
        else {
            res.send('Mã QR không hợp lệ')
        }
    })
})

router.get('/scan-qrcode', (req, res) => {
    User.findOne({ email: req.session.user }, (err, us) => {
        if (us.actor == 'staff') {
            res.render('qrcode/scanQR', {
                cats: cats,
                filmArrs:films
            });
        } else {
            res.render('error', {
                mes: 'Bạn không có quyền truy cập'
            });
        }
    })
})

router.post('/check-in', (req, res) => {
    var idBill = req.body.idBill;
    Bill.findById(idBill, (err, bi) => {
        bi.checkin = 1;
        bi.save(function (err) {
            if (err) throw err;
            res.send('success')
        })
    })
})

module.exports = router;