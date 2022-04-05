var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    password:{
        type: String,
        required : true
    },
    fullname:{
        type: String,
        required : true
    },
    birthday:{
        type: String,
        required : true
    },
    admin:{
        type: Number,
        default:0
    },
    gender:{
        type: String,
        required : true
    },
    phone:{
        type:String,
        required : true
    },
    photo:{
        type:String,
        default:"",
    },
    photodrop:{
        type:String,
        default:"",
    },
    block:{
        type: Object,
        default: {
            type : 0,
            dateto:"",
            realdate:"",
        },
    },
})

var User = module.exports = mongoose.model('User',UserSchema);