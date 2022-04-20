var mongoose = require('mongoose')

var SnackSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    type:{
        type: String,
        required : true
    },
    block:{
        type:Number,
        default:1,
    },
    price:{
        type:Number,
        required:true,
    },
    photo:{
        type:String,
        required:true
    },
    photoDrop:{
        type:String,
        required:true
    }
})

var snack = module.exports = mongoose.model('snacks',SnackSchema);