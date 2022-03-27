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
        type: String,
        required : true
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
    }
})

var User = module.exports = mongoose.model('User',UserSchema);