var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/info', (req, res) => {
    res.render('user/UserInfo');
})

module.exports = router;