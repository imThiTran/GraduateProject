var Showtime = require('../models/showtime');

module.exports = function (req, res, next) {
    var today = new Date();
    var date = today.toLocaleDateString('en-CA');
    var hour = (today.getHours() < 10) ? ('0' + today.getHours()) : today.getHours();
    var minute = (today.getMinutes() < 10) ? ('0' + today.getMinutes()) : today.getMinutes();
    var time = hour + ':' + minute;
    Showtime.updateMany({
        $or: [{date:{$lt:date}},
        {date:date,timeStart:{$lte:time}}]
    },
        {
            $set: { closed: '1' }
        }, function (err, result) {
            if (err) throw err;
            next();
        })
}