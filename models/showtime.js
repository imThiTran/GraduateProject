var mongoose = require('mongoose')

var ShowtimeSchema = mongoose.Schema({
    date:{
        type : String,
        required : true
    },
    timeStart:{
        type: String
    },
    timeEnd:{
        type: String,
        default:""
    },
    idFilm:{
        type: String,
    },
})

var Showtime = module.exports = mongoose.model('showtimes',ShowtimeSchema);