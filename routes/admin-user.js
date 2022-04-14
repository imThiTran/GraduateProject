var express = require('express');
var router = express.Router();
var User = require('../models/user');


//loai bo khoang trang trong chuoi
function cleanText(text) {
    return text.replaceAll(/\s+/g, ' ').trim();
}
router.get('/', (req, res) => {
    User.find({ email: { '$ne': req.session.user } }, function (err, us) {
        res.render('admin/admin-user', {
            users: us
        })
    })
})

router.post('/blockbtn', (req, res) => {
    var { idUser, time } = req.body;
    time = parseInt(time);
    var newBlock = {};
    User.findById(idUser, (err, us) => {
        newBlock.type = time;
        if (time == 0 || time == -1) {
            newBlock.dateto = ''
        } else {
            var today = (new Date()).getTime();
            var eachDate = 86400000;
            var dateto = new Date(today + eachDate * time);
            newBlock.dateto = dateto;
        }
        us.block = newBlock;
        us.save(function (err, result) {
            if (err) return console.log(err);
            res.send({
                dateto: result.block.dateto
            });
        });
    })
})

router.post('/decentralize', (req, res) => {
    var { idUser, actor } = req.body;
    User.findById(idUser, (err, us) => {
        us.actor = actor;
        us.save(function (err) {
            res.send('success');
        })
    })
})

router.get('/search', (req, res) => {
    var name = req.query.name;
    User.find({ $or: [{ email: { $regex: name, $options: "$i" } }, { fullname: { $regex: name, $options: "$i" } }] }, function (err, us) {
        res.render('admin/admin-user', {
            users: us
        })
    })
})

module.exports = router;