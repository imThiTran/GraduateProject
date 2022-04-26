var express = require('express');
var router = express.Router();

var Bill = require('../models/bill')
var Category = require('../models/category');
var cats = []
Category.find({}, function (err, categories) {
    cats = categories
})


router.post('/scan-bill', (req, res) => {
    var qrcode = req.body.qrcode;
    Bill.findById(qrcode, (err, bi) => {
        if (bi) {
            if (bi.checkin == 0) res.send(bi);
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
    res.render('qrcode/scanQR',{
        cats:cats
    });
})

module.exports=router;