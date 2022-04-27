var mongoose = require('mongoose')

var VoucherSchema = mongoose.Schema({    
   code:{
       type:String
   },
   value:{
       type:String
   },
   user:{
        type:Array,
        default:[]
   }
})

var Voucher = module.exports = mongoose.model('vouchers',VoucherSchema);