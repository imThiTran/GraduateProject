var mongoose = require('mongoose')

var TkPriceSchema = mongoose.Schema({
    timeSlot1:{
        type:Object,
    },
    timeSlot2:{
        type:Object,
    },
    type:{
        type:String
    }
})

var TkPrice = module.exports = mongoose.model('ticketprices',TkPriceSchema);