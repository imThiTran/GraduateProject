var express = require('express');
var router = express.Router();
var fs = require('fs');
var cloudinary = require('cloudinary').v2;
const Snack = require('../models/snack');


router.get('/', (req, res) => {
    Snack.find({}, (err, sn) => {
        res.render('admin/admin-snack', {
            snacks: sn
        });
    })
})

router.post('/add-snack', (req, res) => {
    var { name, type, price } = req.body;
    price = parseInt(price);
    if (req.files != null) imageFile = req.files.image;
    else imageFile = "";
    Snack.findOne({ name: name }, (err, sn) => {
        if (sn) res.send('Món này đã tồn tại');
        else {
            if (imageFile != "") {
                cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "cinema/snacks/" + name }, function (err, rs) {
                    if (err) throw err;
                    var snack = new Snack({
                        name: name,
                        type: type,
                        price: price,
                        photo: rs.url,
                        photoDrop: rs.public_id
                    })
                    fs.unlink(imageFile.tempFilePath, function (err) {
                        if (err) throw err;
                    })
                    snack.save(function (err, result) {
                        if (err) throw err;
                        res.send(result);
                    });
                })
            } else {
                res.send('Bạn chưa thêm ảnh');
            }
        }
    })
})

router.post('/load-edit/:id', (req, res) => {
    var id = req.params.id;
    Snack.findById(id, (err, sn) => {
        if (err) throw err;
        res.send(sn);
    })
})

router.post('/block', (req, res) => {
    var { idSnack, block } = req.body;
    Snack.findById(idSnack, (err, sn) => {
        if (err) throw err;
        sn.block = block;
        sn.save(function (err) {
            res.send('success');
        })
    })
})

router.get('/delete-snack/:id', (req, res) => {
    var idSnack = req.params.id;
    Snack.findByIdAndRemove(idSnack, (err) => {
        if (err) throw err;
        res.send('success');
    })
})

router.post('/edit-snack', (req, res) => {
    var { name, type, price, pimage, idSnack } = req.body;
    if (req.files != null) imageFile = req.files.image;
    else imageFile = "";
    Snack.findOne({ name: name, _id: { $ne: idSnack } }, (err, snExist) => {
        if (snExist) res.send('Món này đã tồn tại');
        else {
            Snack.findById(idSnack, (err, sn) => {
                sn.name = name;
                sn.type = type;
                sn.price = parseInt(price);
                if (imageFile != "") {
                    cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "cinema/snacks/" + name }, function (err, rs) {
                        if (err) throw err;
                        sn.photo = rs.url,
                            sn.photoDrop = rs.public_id
                    })
                    fs.unlink(imageFile.tempFilePath, function (err) {
                        if (err) throw err;
                    })
                    cloudinary.uploader.destroy(pimage, function (err, rs) {
                        if (err) throw err;
                    })
                    sn.save(function (err, result) {
                        if (err) throw err;
                        res.send(result);
                    });
                } else {
                    sn.save(function (err, result) {
                        if (err) throw err;
                        res.send(result);
                    });
                }
            })
        }
    })
})

module.exports = router;