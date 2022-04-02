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
        type: String
    },
    backgound:{
        type: String
    },
    slug:{
        type: String
    },
    directors:{
        type: String
    },
    cast:{
        type: String
    },
    premiere:{
        type: String
    },
    time:{
        type: String
    },
    detail:{
        type: String
    },
    trailer:{
        type:String
    },
    idcat:{
        type: String
    },
    comments:{
        type:Array,
        default:[]
    },
    ratings:{
        type:Array,
        default:[]
    }
})

var Film = module.exports = mongoose.model('films',FilmSchema);