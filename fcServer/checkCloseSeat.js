var Room = require('../models/room')
var Ticket = require('../models/ticket')
var Showtime=require('../models/showtime')

function checkCloseSeat(){
     setInterval(function () {
        //checkpayment
        Room.find({},(err,ro)=>{
            var roHasSeatClose=ro.filter(r=>r.seatBlock.length>0);
            Showtime.find({},(err,st)=>{
                var ShowtimeClose=[];
                roHasSeatClose.forEach(function(ro){
                    st.forEach(function(stFe){
                        if (stFe.idRoom==ro._id.toString()) ShowtimeClose.push({
                            idSt:stFe._id.toString(),
                            seatBlock:ro.seatBlock
                        })
                    })
                    ShowtimeClose.forEach(function(ShowtimeCloseFe){
                        Ticket.updateMany({ idShowtime: ShowtimeCloseFe.idSt, name: { $in: ShowtimeCloseFe.seatBlock } },
                    {
                        $set: { available:-1  }
                    }, function (err, result) {
                        if (err) throw err;
                    })       
                    })
                })
            })
        })
     }, 2000);
}
module.exports = checkCloseSeat();