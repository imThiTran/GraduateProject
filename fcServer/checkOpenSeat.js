var Room = require('../models/room')
var Ticket = require('../models/ticket')
var Showtime=require('../models/showtime')

function checkOpenSeat(){
     setInterval(function () {
        //checkpayment
       Ticket.find({available:-1},(err,tk)=>{
           Showtime.find({},(err,st)=>{
               Room.find({},(err,ro)=>{
                   tk.forEach(function(tkFe){
                       for(var i=0;i<st.length;i++){
                        if (tkFe.idShowtime==st[i]._id.toString()){
                            for(var j=0;j<ro.length;j++){
                                if (ro[j]._id.toString()==st[i].idRoom){
                                    if (ro[j].seatBlock.indexOf(tkFe.name)==-1){
                                        tkFe.available=1;
                                        tkFe.save();
                                    }
                                    break;
                                }
                            };
                            break;
                        }
                       }           
                   })
               })
           })
       })
     }, 2000);
}
module.exports = checkOpenSeat();