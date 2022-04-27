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
    },
    holiday:{
        type:Object,
    }
})

var TkPrice = module.exports = mongoose.model('ticketprices',TkPriceSchema);