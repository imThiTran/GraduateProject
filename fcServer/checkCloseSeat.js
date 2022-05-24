var Room = require('../models/room')
var Ticket = require('../models/ticket')
var Showtime=require('../models/showtime')

function checPayment(){
    setInterval(function () {
        //checkpayment
        Bill.find({payment:'0'}, function(err,bills){              
            bills.forEach((bill)=>{
                //Check booking time quá 10p
                if((date-bill.timebooking)>600000){
                    Ticket.updateMany({"_id": {"$in" : bill.ticket}},{$set: {available:'1'}},function(err,tk){
                        if (err) throw err; 
                    })
                    Bill.findByIdAndRemove(bill._id, (err) => {
                        if (err) throw err;                        
                    })                    
                }                    
            })
        })
    }, 2000);
}
module.exports = checPayment();