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
   status:{
       type: String,
       default: '0'
   },
   discount:{
       type:String
   },
   total:{
       type:String
   },
   user:{
       type:String
   }
})

var Bill = module.exports = mongoose.model('Bills',BillSchema);