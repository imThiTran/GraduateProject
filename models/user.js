var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    password:{
        type: String
    },
    fullname:{
        type: String
    },
    birthday:{
        type: String,
    },
    admin:{
        type: Number,
    },
    gender:{
        type: String,
    },
    phone:{
        type:String
    },
    photo:{
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
    resetLink: {
        type: String,
        default:''
    }
})

var User = module.exports = mongoose.model('User',UserSchema);