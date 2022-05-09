var mongoose = require('mongoose')
function makecode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';   
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
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
       default: makecode(6),
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