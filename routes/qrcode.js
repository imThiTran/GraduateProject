var express = require('express');
var router = express.Router();

var Bill = require('../models/bill');
var Showtime = require('../models/showtime');
var Film = require('../models/film');
var Category = require('../models/category');
var Room = require('../models/room');
const User = require('../models/user');
var cats = []
Category.find({}, function (err, categories) {
    cats = categories
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
    Bill.findById(qrcode, (err, bi) => {
        if (bi) {
            if (bi.checkin == 0) {
                Showtime.findById(bi.ticket[0].idShowtime, (err, st) => {
                    var dateSt = generateDate(st.date, st.timeStart);
                    if ((dateSt.getTime() + 1800000) < (new Date()).getTime()) res.send('Suất chiếu này đã hết hạn');
                    else {
                        Film.findById(st.idFilm, (err, fi) => {
                            Room.findById(st.idRoom, (err, ro) => {
                                var tickets = '', snacks = '';
                                var timeStartArr = st.timeStart.split(':');
                                st.timeStart = st.timeStart + ((timeStartArr[0] < 12) ? (' AM') : (' PM'));
                                bi.ticket.forEach(function (tk, index) {
                                    if (index == bi.ticket.length - 1) tickets = tickets + tk.name;
                                    else tickets = tickets + tk.name + ', '
                                })
                                if (bi.snack.length != 0) {
                                    bi.snack.forEach(function (sn, index) {
                                        if (index == bi.snack.length - 1) snacks = snacks + sn.quantity + ' x ' + sn.name;
                                        else snacks = snacks + sn.quantity + ' x ' + sn.name + ', '
                                    })
                                }
                                res.send({
                                    id: bi._id,
                                    timePrint: date + ' ' + time,
                                    fullname: bi.fullname,
                                    nameEN: fi.nameEN,
                                    nameVN: fi.nameVN,
                                    date: new Date(st.date).toLocaleDateString('en-GB'),
                                    time: st.timeStart,
                                    room: ro.name,
                                    ticket: tickets,
                                    snack: snacks,
                                    total: bi.total
                                });
                            })
                        })
                    }
                })
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
    Bill.findOne({code:qrcode}, (err, bi) => {
        if (bi) {
            if (bi.checkin == 0) {
                Showtime.findById(bi.ticket[0].idShowtime, (err, st) => {
                    var dateSt = generateDate(st.date, st.timeStart);
                    if ((dateSt.getTime() + 1800000) < (new Date()).getTime()) res.send('Suất chiếu này đã hết hạn');
                    else {
                        Film.findById(st.idFilm, (err, fi) => {
                            Room.findById(st.idRoom, (err, ro) => {
                                var tickets = '', snacks = '';
                                var timeStartArr = st.timeStart.split(':');
                                st.timeStart = st.timeStart + ((timeStartArr[0] < 12) ? (' AM') : (' PM'));
                                bi.ticket.forEach(function (tk, index) {
                                    if (index == bi.ticket.length - 1) tickets = tickets + tk.name;
                                    else tickets = tickets + tk.name + ', '
                                })
                                if (bi.snack.length != 0) {
                                    bi.snack.forEach(function (sn, index) {
                                        if (index == bi.snack.length - 1) snacks = snacks + sn.quantity + ' x ' + sn.name;
                                        else snacks = snacks + sn.quantity + ' x ' + sn.name + ', '
                                    })
                                }
                                res.send({
                                    id: bi._id,
                                    timePrint: date + ' ' + time,
                                    fullname: bi.fullname,
                                    nameEN: fi.nameEN,
                                    nameVN: fi.nameVN,
                                    date: new Date(st.date).toLocaleDateString('en-GB'),
                                    time: st.timeStart,
                                    room: ro.name,
                                    ticket: tickets,
                                    snack: snacks,
                                    total: bi.total
                                });
                            })
                        })
                    }
                })
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
                cats: cats
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