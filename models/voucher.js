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
    },
    datefrom:{
        type: Date
    },
    dateto:{
        type: Date
    },
    current:{
        type: String
    },
    idEvent:{
        type:String
    }
})

var Voucher = module.exports = mongoose.model('vouchers',VoucherSchema);