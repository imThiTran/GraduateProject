var express = require('express');
var router = express.Router();
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Ticket = require('../models/ticket');
var shortId = require('shortid');
const Room = require('../models/room');
const TicketPrice = require('../models/ticket-price');


//loai bo khoang trang trong chuoi
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

router.get('/', (req, res) => {
    var showtimeArr = [];
    var times = [];
    var date = [];
    var descrb = [];
    TicketPrice.findOne({ purpose: 'price' }, (err, tkpr) => {
        Film.find({ status: 'Đang khởi chiếu' }, (err, fi) => {
            Showtime.find({}, (err, st) => {
                Room.find({ block: 0 }, (err, ro) => {
                    fi.forEach(function (f) {
                        descrb = [];
                        date = [];
                        st.forEach(function (s) {
                            if (s.idFilm == f._id.toString())
                                date.push(s.date);
                        })
                        date = Array.from(new Set(date));
                        if (date.length != 0) {
                            date.forEach(function (d) {
                                times = [];
                                st.forEach(function (s) {
                                    if (s.date == d && s.idFilm == f._id.toString())
                                        times.push({
                                            timeStart: s.timeStart,
                                            closed: s.closed,
                                            id: s._id.toString()
                                        });
                                })
                                descrb.push({
                                    nameDate: d,
                                    times: times
                                })
                            })
                            showtimeArr.push({
                                idFilm: f._id,
                                nameEN: f.nameEN,
                                nameVN: f.nameVN,
                                photo: f.photo,
                                descrb: descrb
                            })
                        }
                    })
                    res.render('admin/admin-showtime', {
                        showtimes: showtimeArr,
                        films: fi,
                        rooms: ro,
                        singleSeat: tkpr.singleSeat,
                        coupleSeat: tkpr.coupleSeat,
                    });
                })
            })
        })
    })
})

function transferTimeEnd(timeStart, time) {
    time = parseInt(time);
    var hourAdd = Math.floor((time + 30) / 60);
    var minuteAdd = (time + 30) % 60;
    var ArrTimeStart = timeStart.split(':');
    var newHour = parseInt(ArrTimeStart[0]) + hourAdd;
    var newMinute = parseInt(ArrTimeStart[1]) + minuteAdd;
    if (newMinute >= 60) {
        newMinute = newMinute - 60;
        newHour = newHour + 1;
    }
    return ((newHour < 10) ? ('0' + newHour) : newHour) + ':' + ((newMinute < 10) ? ('0' + newMinute) : newMinute);
}

router.post('/add-showtime', (req, res) => {
    const { date, idAndTime, hour, minute, roomAndType } = req.body;
    var timeStart;
    var idAndTimeArr = idAndTime.split('/');
    var idFilm = idAndTimeArr[0];
    var time = idAndTimeArr[1];
    var today = new Date();
    var singleSeat, coupleSeat;
    TicketPrice.findOne({ purpose: 'price' }, (err, tkpr) => {
        singleSeat = tkpr.singleSeat;
        coupleSeat = tkpr.coupleSeat;
    })
    if (typeof roomAndType == "string") {
        var roomAndTypeArr = roomAndType.split('/');
        var room = roomAndTypeArr[0];
        var typeRoom = roomAndTypeArr[1];
        timeStart = hour + ':' + minute;
        var newDay = new Date(date);
        var timeArr = timeStart.split(':');
        newDay.setHours(timeArr[0], timeArr[1]);
        if (newDay <= today) { //kiem tra suất chiếu có sớm hơn thực tại
            res.send("Không được phép tạo suất chiếu trước giờ hiện tại");
        }
        else {
            var timeEnd = transferTimeEnd(timeStart, time);
            Showtime.findOne({
                date: date, idRoom: room, $or: [     //kiem tra suat chieu nay da ton tai hay khong
                    { timeStart: { $lte: timeStart }, timeEnd: { $gte: timeStart } },
                    { timeStart: { $lte: timeEnd }, timeEnd: { $gte: timeEnd } }
                ]
            }, (err, st) => {
                if (st) {
                    res.send('Tồn tại suất chiếu trùng thời gian');
                } else {
                    var tickets = []; //du lieu ve add vao db
                    var name;
                    var showtime = new Showtime({
                        date: date,
                        timeStart: timeStart,
                        timeEnd: timeEnd,
                        idRoom: room,
                        idFilm: idFilm
                    })
                    showtime.save(function (err, result) {
                        if (err) return console.log(err);
                        if (typeRoom == 114) {
                            for (var i = 0; i <= 9; i++) {
                                switch (i) {
                                    case 0: name = 'A'; break;
                                    case 1: name = 'B'; break;
                                    case 2: name = 'C'; break;
                                    case 3: name = 'D'; break;
                                    case 4: name = 'E'; break;
                                    case 5: name = 'F'; break;
                                    case 6: name = 'G'; break;
                                    case 7: name = 'H'; break;
                                    case 8: name = 'J'; break;
                                    case 9: name = 'K'; break;
                                    default: '';
                                }
                                for (var j = 1; j <= 12; j++) {
                                    if (i != 9) {
                                        tickets.push({
                                            idShowtime: result._id,
                                            name: name + j,
                                            price: singleSeat,
                                            sorting: (12 * i) + j,
                                        })
                                    } else {
                                        if (j == 7) break;
                                        tickets.push({
                                            idShowtime: result._id,
                                            name: name + j,
                                            price: coupleSeat,
                                            sorting: (12 * i) + j,
                                        })
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i <= 8; i++) {
                                switch (i) {
                                    case 0: name = 'A'; break;
                                    case 1: name = 'B'; break;
                                    case 2: name = 'C'; break;
                                    case 3: name = 'D'; break;
                                    case 4: name = 'E'; break;
                                    case 5: name = 'F'; break;
                                    case 6: name = 'G'; break;
                                    case 7: name = 'H'; break;
                                    case 8: name = 'K'; break;
                                    default: '';
                                }
                                for (var j = 1; j <= 10; j++) {
                                    if (i != 8) {
                                        tickets.push({
                                            idShowtime: result._id,
                                            name: name + j,
                                            price: singleSeat,
                                            sorting: (10 * i) + j,
                                        })
                                    } else {
                                        if (j == 6) break;
                                        tickets.push({
                                            idShowtime: result._id,
                                            name: name + j,
                                            price: coupleSeat,
                                            sorting: (10 * i) + j,
                                        })
                                    }
                                }
                            }
                        }
                        Ticket.insertMany(tickets);
                        res.send('success');
                    })
                }
            })
        }
    } else { //else room = array
        var checkTime = true;
        var room = [];
        var type = [];
        roomAndType.forEach(function (each) {
            var roomAndTypeArr = each.split('/');
            room.push(roomAndTypeArr[0]);
            type.push(roomAndTypeArr[1]);
        })
        timeStart = [];
        hour.forEach(function (hourFe, index) {
            timeStart.push(hourFe + ':' + minute[index]);
        })
        timeStart.forEach(function (timeStart) {
            var newDay = new Date(date);
            var timeArr = timeStart.split(':');
            newDay.setHours(timeArr[0], timeArr[1]);
            if (newDay <= today) checkTime = false;
        })
        if (checkTime == false) {
            res.send("Không được phép tạo suất chiếu trước giờ hiện tại");
        }
        else {
            var check = true; //kiem tra cac suat chieu da them co mau thuan khong
            var timeEnd = [];

            timeStart.forEach(function (timeStart) {
                var newTimeEnd = transferTimeEnd(timeStart, time);
                timeEnd.push(newTimeEnd);
            })
            for (var i = 0; i < timeStart.length; i++)
                for (var j = i + 1; j < timeStart.length; j++) {
                    if (room[i] == room[j]) {
                        if ((timeStart[j] <= timeStart[i] && timeStart[i] <= timeEnd[j])
                            || (timeStart[j] <= timeEnd[i] && timeEnd[i] <= timeEnd[j]))
                            check = false;
                    }
                }
            if (check == false) {
                res.send("Thời gian giữa các suất chiếu trùng nhau");
            } else {
                var checkExist = true; // kiem tra suat chieu da ton tai
                Showtime.find({}, (err, st) => {
                    for (var i = 0; i < st.length; i++)
                        for (var j = 0; j < timeStart.length; j++) {
                            if (st[i].date == date && st[i].idRoom == room[j] &&
                                (
                                    (st[i].timeStart <= timeStart[j] && st[i].timeEnd >= timeStart[j]) ||
                                    (st[i].timeStart <= timeEnd[j] && st[i].timeEnd >= timeEnd[j])
                                )
                            ) { checkExist = false; break; }
                        }
                    if (checkExist == false) {
                        res.send('Tồn tại suất chiếu trùng thời gian');
                    } else {
                        var tickets = []; //du lieu ve add vao db
                        var showtimes = [];//du lieu suat chieu add vao db
                        var name;
                        for (var i = 0; i < room.length; i++) {
                            showtimes.push({
                                date: date,
                                idFilm: idFilm,
                                timeStart: timeStart[i],
                                timeEnd: timeEnd[i],
                                idRoom: room[i],
                            })
                        }
                        Showtime.insertMany(showtimes).then(function (result) {
                            result.forEach(function (st, index) {
                                if (type[index] == 114) {
                                    for (var i = 0; i <= 9; i++) {
                                        switch (i) {
                                            case 0: name = 'A'; break;
                                            case 1: name = 'B'; break;
                                            case 2: name = 'C'; break;
                                            case 3: name = 'D'; break;
                                            case 4: name = 'E'; break;
                                            case 5: name = 'F'; break;
                                            case 6: name = 'G'; break;
                                            case 7: name = 'H'; break;
                                            case 8: name = 'J'; break;
                                            case 9: name = 'K'; break;
                                            default: '';
                                        }
                                        for (var j = 1; j <= 12; j++) {
                                            if (i != 9) {
                                                tickets.push({
                                                    idShowtime: st._id,
                                                    name: name + j,
                                                    price: singleSeat,
                                                    sorting: (12 * i) + j,
                                                })
                                            } else {
                                                if (j == 7) break;
                                                tickets.push({
                                                    idShowtime: st._id,
                                                    name: name + j,
                                                    price: coupleSeat,
                                                    sorting: (12 * i) + j,
                                                })
                                            }
                                        }
                                    }
                                } else {
                                    for (var i = 0; i <= 8; i++) {
                                        switch (i) {
                                            case 0: name = 'A'; break;
                                            case 1: name = 'B'; break;
                                            case 2: name = 'C'; break;
                                            case 3: name = 'D'; break;
                                            case 4: name = 'E'; break;
                                            case 5: name = 'F'; break;
                                            case 6: name = 'G'; break;
                                            case 7: name = 'H'; break;
                                            case 8: name = 'K'; break;
                                            default: '';
                                        }
                                        for (var j = 1; j <= 10; j++) {
                                            if (i != 8) {
                                                tickets.push({
                                                    idShowtime: st._id,
                                                    name: name + j,
                                                    price: singleSeat,
                                                    sorting: (10 * i) + j,
                                                })
                                            } else {
                                                if (j == 6) break;
                                                tickets.push({
                                                    idShowtime: st._id,
                                                    name: name + j,
                                                    price: coupleSeat,
                                                    sorting: (10 * i) + j,
                                                })
                                            }
                                        }
                                    }
                                }
                            })
                            Ticket.insertMany(tickets);
                            res.send('success');
                        });
                    }
                })
            }
        }
    }
})


router.post('/load-edit', (req, res) => {
    var idSt = req.body.idSt;
    var typeRoom;
    Showtime.findById(idSt, (err, st) => {
        Room.find({}, (err, ro) => {
            ro.forEach(function (roFe) {
                if (roFe._id == st.idRoom) { typeRoom = roFe.type; return false }
            });
            ro = ro.filter(roFt => (roFt.type == typeRoom));
            Film.findOne({ id: st.idFilm }, (err, fi) => {
                var hour = st.timeStart.split(':')[0];
                var minute = st.timeStart.split(':')[1];
                res.send({
                    nameEN: fi.nameEN,
                    time: fi.time,
                    closed: st.closed,
                    date: st.date,
                    hour: hour,
                    minute: minute,
                    room: st.idRoom,
                    rooms: ro
                })
            })
        })
    })
})

router.post('/edit-showtime', (req, res) => {
    var { idSt, hour, minute, room, closed, time, date } = req.body;
    var today = new Date();
    Showtime.findOne({ _id: idSt }, (err, st) => {
        var editDate = new Date(st.date);
        editDate.setHours(st.timeStart.split(':')[0], st.timeStart.split(':')[1]);
        if (today >= editDate) {
            res.send('Suất chiếu này đã hết hạn và không thể chỉnh sửa');
        } else {
            editDate = new Date(date);
            editDate.setHours(hour, minute);
            if (today >= editDate) {
                res.send('Thời gian bạn muốn chỉnh sửa sớm hơn thời điểm hiện tại');
            } else {
                if (closed == '') closed = 1;
                var timeStart = hour + ':' + minute;
                if (typeof closed == "undefined") closed = 1;
                var timeEnd = transferTimeEnd(timeStart, time);
                Showtime.findOne({
                    _id: { $ne: idSt }, date: date, idRoom: room, $or: [     //kiem tra suat chieu nay da ton tai hay khong
                        { timeStart: { $lte: timeStart }, timeEnd: { $gte: timeStart } },
                        { timeStart: { $lte: timeEnd }, timeEnd: { $gte: timeEnd } }
                    ]
                }, (err, st) => {
                    if (st) {
                        res.send('Tồn tại suất chiếu trùng thời gian');
                    } else {
                        Showtime.updateOne({ _id: idSt },
                            {
                                $set: { closed: closed, blockByRoom: 0, timeStart: timeStart, idRoom: room }
                            }, function (err, result) {
                                if (err) throw err;
                                res.send({
                                    timeStart: timeStart,
                                    closed: closed
                                });
                            })
                    }
                })
            }
        }
    })
})

router.get('/delete-showtime/:idSt', (req, res) => {
    var idSt = req.params.idSt;
    Ticket.deleteMany({ idShowtime: idSt }, (err) => {
        Showtime.findByIdAndRemove(idSt, function (err) {
            if (err) return console.log(err);
            res.send('success');
        })
    })
})

router.post('/delete-showtime-date', (req, res) => {
    var { idFilm, date } = req.body;
    Showtime.find({ idFilm: idFilm, date: date }, (err, st) => {
        var idStDelete = st.map(s => s._id.toString());
        Ticket.deleteMany({ idShowtime: { $in: idStDelete } }, (err) => {
            Showtime.deleteMany({ idFilm: idFilm, date: date }, (err) => {
                if (err) return console.log(err);
                res.send('success');
            })
        })
    })
})

function compareDate(datefrom, dateto, date, time) {
    var timeArr = time.split(':');
    var dateCompare = new Date(date);
    dateCompare.setHours(timeArr[0], timeArr[1]);
    if (dateCompare >= datefrom && dateCompare <= dateto) return true;
    return false;
}

router.get('/search-time', (req, res) => {
    var { name, datefrom, dateto } = req.query;
    var showtimeArr = [];
    var times = [];
    var date = [];
    var descrb = [];
    df = new Date(datefrom);
    dt = new Date(dateto);
    Film.find({ status: 'Đang khởi chiếu' }, (err, films) => {
        TicketPrice.findOne({ purpose: 'price' }, (err, tkpr) => {
            Room.find({ block: 0 }, async (err, ro) => {
                var st = await Showtime.find({});
                var fi;
                if (datefrom == '') {
                    fi = await Film.find({ $or: [{ nameEN: { $regex: name, $options: "$i" } }, { nameVN: { $regex: name, $options: "$i" } }] });
                } else if (name == '') {
                    fi = await Film.find({});
                    st = st.filter(stFt => compareDate(df, dt, stFt.date, stFt.timeStart));
                } else {
                    fi = await Film.find({ $or: [{ nameEN: { $regex: name, $options: "$i" } }, { nameVN: { $regex: name, $options: "$i" } }] });
                    st = st.filter(stFt => compareDate(df, dt, stFt.date, stFt.timeStart));
                }
                fi.forEach(function (f) {
                    descrb = [];
                    date = [];
                    st.forEach(function (s) {
                        if (s.idFilm == f._id.toString())
                            date.push(s.date);
                    })
                    date = Array.from(new Set(date));
                    if (date.length != 0) {
                        date.forEach(function (d) {
                            times = [];
                            st.forEach(function (s) {
                                if (s.date == d && s.idFilm == f._id.toString())
                                    times.push({
                                        timeStart: s.timeStart,
                                        closed: s.closed,
                                        id: s._id.toString()
                                    });
                            })
                            descrb.push({
                                nameDate: d,
                                times: times
                            })
                        })
                        showtimeArr.push({
                            idFilm: f._id,
                            nameEN: f.nameEN,
                            nameVN: f.nameVN,
                            photo: f.photo,
                            descrb: descrb
                        })
                    }
                })
                res.render('admin/admin-showtime', {
                    showtimes: showtimeArr,
                    films: films,
                    rooms: ro,
                    name: name,
                    datefrom: datefrom,
                    dateto: dateto,
                    singleSeat: tkpr.singleSeat,
                    coupleSeat: tkpr.coupleSeat
                });
            })
        })
    })
})

module.exports = router;