var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var Bill = require('../models/bill')
var Ticket = require('../models/ticket');
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Room = require('../models/room');
var Snack = require('../models/snack')
var Category = require('../models/category');

var partnerCode = process.env.partnerCode
var accessKey = process.env.accessKey
var secretkey = process.env.secretkey
var requestId = partnerCode + new Date().getTime();
var orderInfo = "Thanh toán đơn hàng Megas";
var redirectUrl = process.env.CLIENT_URL + "/payment/confirm";
var ipnUrl = "https://callback.url/notify";
var requestType = "captureWallet"
var extraData = "";

var snacklist = []
Snack.find({}, function (err, snacks) {
    snacklist = snacks
})
var cats = []
Category.find({}, function (err, categories) {
    cats = categories
})
router.post('/', (request, response) => {
    var { ticket, fullname, phone } = request.body
    var body = request.body    
    var snacks=[]
    for (key in body ) {
        if(key!="ticket" && key!="idst"){
            if(body[key]!='0'){
                let snack={id:key,value:body[key]}
                snacks.push(snack)
            }
        }
    }
    var snackarr=[]
    snacks.forEach(snack => {
        snacklist.forEach(sn => {
            if(snack.id==sn._id){
                let item={
                    id:snack.id,
                    name:sn.name,
                    price:sn.price,
                    quantity:snack.value
                }
                snackarr.push(item)
            }
        })
    })
    var check = true
    Ticket.find({ "_id": { "$in": ticket } }, function (err, tk) {
        tk.forEach(ticketcheck => {
            if (ticketcheck.available == '0') {
                check = false
            }
        })
        snacks.forEach(snack => {
            snacklist.forEach(sn => {
                if(snack.id==sn._id && sn.block==1){
                    check = false         
                }
            })
        })
        if (check) {
            var total = 0
            if (ticket == "string") {
                total = tk
                snackarr.forEach(item => {
                    total+=item.price*item.quantity
                })
            } else {
                tk.forEach(ticket => {
                    total += ticket.price
                })
                snackarr.forEach(item => {
                    total+=item.price*item.quantity
                })
            }
            var bill = new Bill({
                ticket: tk,
                total: total,
                user: request.session.user,
                fullname: fullname,
                phone: phone,
                snack:snackarr
            })
            bill.save(function (err, bill) {
                var orderId = bill._id;
                var amount = bill.total;
                var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
                var signature = crypto.createHmac('sha256', secretkey)
                    .update(rawSignature)
                    .digest('hex');
                const requestBody = JSON.stringify({
                    partnerCode: partnerCode,
                    accessKey: accessKey,
                    requestId: requestId,
                    amount: amount,
                    orderId: orderId,
                    orderInfo: orderInfo,
                    redirectUrl: redirectUrl,
                    ipnUrl: ipnUrl,
                    extraData: extraData,
                    requestType: requestType,
                    signature: signature,
                    lang: 'en'
                });
                //Create the HTTPS objects
                const https = require('https');
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    }
                }
                const req = https.request(options, res => {
                    res.setEncoding('utf8');
                    res.on('data', (body) => {
                        if (JSON.parse(body).payUrl) {
                            Ticket.updateMany({ "_id": { "$in": ticket } }, { $set: { available: '0' } }, function (err, tk) {
                                if (err) throw err;
                            })
                            response.redirect(JSON.parse(body).payUrl);
                        } else {
                            response.status(404).render('error', {
                                mes: 'Page Not Found'
                            });
                        }
                    });
                    res.on('end', () => {

                    });
                })
                req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });
                req.write(requestBody);
                req.end();
            })
        } else {
            response.send("Đã có lỗi xảy ra")
        }

    })
})


router.get('/confirm', (req, res) => {
    var query = req.query;
    var signature = req.query.signature;
    var rawSignaturenew = "accessKey=" + accessKey
        + "&amount=" + query.amount
        + "&extraData=" + query.extraData
        + "&message=" + query.message
        + "&orderId=" + query.orderId
        + "&orderInfo=" + query.orderInfo
        + "&orderType=" + query.orderType
        + "&partnerCode=" + query.partnerCode
        + "&payType=" + query.payType
        + "&requestId=" + query.requestId
        + "&responseTime=" + query.responseTime
        + "&resultCode=" + query.resultCode
        + "&transId=" + query.transId
    if (signature === crypto.createHmac('sha256', secretkey).update(rawSignaturenew).digest('hex')) {
        if (query.resultCode == 0) {
            Bill.findById(query.orderId, function (err, bill) {
                if(bill.payment == '1'){
                    res.status(404).render('error', {
                        mes: 'Page Not Found'
                    });
                }else{
                    bill.payment = 1;
                    bill.save(function (err) {
                        if (err) throw err;
                    });
                    Showtime.findById(bill.ticket[0].idShowtime, function (err, st) {
                        Film.findById(st.idFilm, function (err, film) {
                            Room.findById(st.idRoom, function (err, room) {
                                res.render('payment/detail-bill', {
                                    bill: bill,
                                    st: st,
                                    film: film,
                                    room: room,
                                    cats:cats
                                })
                            })
                        })
                    })
                }                
            })
        } else {
            res.send('Thanh toán thất bại')
        }
    } else {
        res.status(404).render('error', {
            mes: 'Page Not Found'
        });
    }
})

router.post('/scan-bill', (req, res) => {
    var qrcode = req.body.qrcode;
    Bill.findById(qrcode, (err, bi) => {
        if (bi) {
            if (bi.checkin == 0) res.send(bi);
            else {
                res.send('Bill đã được sử dụng')
            }
        }
        else {
            res.send('Mã QR không hợp lệ')
        }
    })
})

router.get('/qrcode', (req, res) => {
    res.render('scanQR',{
        cats:cats
    });
})

module.exports = router;