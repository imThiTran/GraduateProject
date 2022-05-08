var express = require('express');
var router = express.Router();
var fs = require('fs');
const Room = require('../models/room');
const Showtime = require('../models/showtime');
const Ticket = require('../models/ticket');

//loai bo khoang trang trong chuoi
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

router.get('/', (req, res) => {
    Room.find({}, (err, ro) => {
        res.render('admin/admin-room', {
            rooms: ro.reverse()
        });
    })
})

router.post('/add-room', (req, res) => {
    var { name, type } = req.body;
    type = parseInt(type);
    Room.findOne({ name: name }, (err, ro) => {
        if (ro) {
            res.send('Phòng này đã tồn tại');
        } else {
            var room = new Room({
                name: cleanText(name),
                type: type
            })
            room.save(function (err, result) {
                res.send(result);
            })
        }
    })
})

router.get('/delete-room/:id', (req, res) => {
    var id = req.params.id;
    Showtime.find({ idRoom: id }, (err, st) => {
        var idShowtimes = (st.map(s => s._id.toString()));
        Ticket.deleteMany({ idShowtime: { $in: idShowtimes } }, (err) => {
            Showtime.deleteMany({ idRoom: id }, () => {
                Room.findByIdAndRemove(id, function (err) {
                    if (err) return console.log(err);
                    res.send('success');
                })
            });
        });
    })
})

router.get('/search-room', (req, res) => {
    var nameRoom = req.query.nameRoom;
    Room.find({ name: { $regex: nameRoom, $options: "$i" } }, function (err, ro) {
        res.render('admin/admin-room', {
            rooms: ro
        });
    })
})

router.post('/block-room', (req, res) => {
    var { idRoom, block } = req.body;
    Room.findById(idRoom, (err, ro) => {
        ro.block = block;
        ro.save((err) => {
            if (block == 1) {
                Showtime.updateMany({ idRoom: ro._id.toString(), closed: { $ne: "1" } },
                    {
                        $set: { closed: block, blockByRoom: block }
                    }, function (err, result) {
                        if (err) throw err;
                        res.send('success');
                    })
            } else {
                Showtime.updateMany({ idRoom: ro._id.toString(), blockByRoom: 1 },
                    {
                        $set: { closed: block, blockByRoom: block }
                    }, function (err, result) {
                        if (err) throw err;
                        res.send('success');
                    })
            }
        })

    })
})

router.get('/load-edit/:id', (req, res) => {
    var idRoom = req.params.id;
    Room.findById(idRoom, (err, ro) => {
        res.send(ro);
    })
})

router.post('/edit-room', (req, res) => {
    var { name, id } = req.body;
    name = cleanText(name);
    Room.findOne({ name: name, _id: { $ne: id } }, (err, roExist) => {
        if (roExist) res.send('Phòng này đã tồn tại');
        else {
            Room.findById(id, (err, ro) => {
                ro.name = name;
                ro.save(function (err, result) {
                    if (err) throw err;
                    res.send(result);
                })
            })
        }
    })
})

module.exports = router;