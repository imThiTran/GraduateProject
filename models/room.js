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
        required : true
    },
})

var Room = module.exports = mongoose.model('rooms',RoomSchema);