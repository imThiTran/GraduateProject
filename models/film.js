var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameEN:{
        type : String,
        required : true
    },
    nameVN:{
        type: String
    },
    ageLimit:{
        type: String
    },
    photo:{
        type: String,
    },
})

var Film = module.exports = mongoose.model('films',FilmSchema);