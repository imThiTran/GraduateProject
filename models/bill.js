var mongoose = require('mongoose')
var BillSchema = mongoose.Schema({
    timebooking: {
        type: Date,
        default: Date.now
   },
   ticket:{
       type:Array,
       default:[]
   },
   snack:{
       type:Array,
       default:[]
   },
   payment:{
       type: String,
       default: '0'
   },
   checkin:{
       type: String,
       default: '0'
   },
   discount:{
       type:String,
       default: '0'
   },
   total:{
       type:String
   },
   user:{
       type:String
   },
   fullname:{
       type: String
   },
   phone:{
       type:String
   },
   totalbill:{
       type:String
   },
   code:{
       type:String,
       required:true,       
       index: {unique:true}
   },
   film:{
       type:Object
   },
   showtime:{
       type:Object
   },
   room:{
       type:String
   }
})

var Bill = module.exports = mongoose.model('Bills',BillSchema);