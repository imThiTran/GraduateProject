var Voucher = require('../models/voucher')

function resetVoucher(){
    setInterval(function () {
        //checkpayment
        var today = Date.now()
        var day = new Date(today).getDate()
        Voucher.find({}, function(err,vouchers){              
            vouchers.forEach((voucher)=>{
                //Check booking time quá 10p
                if(voucher.datefrom < today && voucher.dateto > today && day!=voucher.current){
                    voucher.current=day
                    voucher.user=[]
                    voucher.save(function(err){
                        if(err) console.log(err)
                    })
                }                  
            })
        })
    }, 5000);
}
module.exports = resetVoucher();