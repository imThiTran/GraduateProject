var mongoose = require('mongoose')

var ShowtimeSchema = mongoose.Schema({
    date:{
        type : String,
        required : true
    },
    timeStart:{
        type: String,
        required : true
    },
    timeEnd:{
        type: String,
        required : true
    },
    idFilm:{
        type: String,
        required : true
    },
    idRoom:{
        type:String,
        required:true,
    },
    closed:{
        type:String,
        default:'0',
    },
    createAt:{
        type:Date,
        default: new Date(),
    },
    blockByRoom:{
        type:Number,
        default:0
    }
})

var Showtime = module.exports = mongoose.model('showtimes',ShowtimeSchema);