var mongoose = require('mongoose')

var TkPriceSchema = mongoose.Schema({
    singleSeat:{
        type:Number,
        required:true
    },
    coupleSeat:{
        type:Number,
        required:true
    },
    purpose:{
        type:String
    }
})

var TkPrice = module.exports = mongoose.model('ticketprices',TkPriceSchema);