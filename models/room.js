var mongoose = require('mongoose')

var RoomSchema = mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    type:{
        type: Number,
        required : true
    },
    block:{
        type: Number,
        default:0
    },
})

var Room = module.exports = mongoose.model('rooms',RoomSchema);