var mongoose = require('mongoose')

var TicketSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    idShowtime:{
        type: String,
        required : true
    },
    available:{
        type:String,
        default:"1",
    },
    price:{
        type:Number,
        required:true,
    },
    sorting:{
        type:Number,
    }

})

var ticket = module.exports = mongoose.model('tickets',TicketSchema);