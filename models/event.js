var mongoose = require('mongoose')

var EventSchema = mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    slug:{
        type: String
    },
    content:{
        type: String,
        required : true
    },
    photo:{
        type: String,
        default:''
    },
    photoDrop:{
        type: String,
        default:'' 
    },
    time: {
        type: Date,
        default: Date.now
   },
   author:{
       type:String
   },
   type:{
       type:String
   }
})

var Event = module.exports = mongoose.model('events',EventSchema);