var mongoose = require('mongoose')

var FilmSchema = mongoose.Schema({
    nameEN:{
        type : String,
        required : true,
    },
    nameVN:{
        type: String
    },
    ageLimit:{
        type: String
    },
    photo:{
        type: String,
        default:''
    },
    photoDrop:{
        type: String,
        default:'' 
    },
    background:{
        type: String,
        default:''
    },
    backgroundDrop:{
        type: String,
        default:''
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
    idCat:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    },
    status:{
        type:String,
        required:true
    },
    ratings:{
        type:Array,
        default:[]
    }
})

var Film = module.exports = mongoose.model('films',FilmSchema);