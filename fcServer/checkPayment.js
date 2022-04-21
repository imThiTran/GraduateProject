var Bill = require('../models/bill')
var Ticket = require('../models/ticket')

function checPayment(){
    setInterval(function () {
        //checkpayment
        var date = Date.now()
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