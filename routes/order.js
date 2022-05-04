var express = require('express');
var router = express.Router();
var Ticket = require('../models/ticket');
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Category = require('../models/category');
var User = require('../models/user');
var Voucher = require('../models/voucher')
const Room = require('../models/room');
var Snack = require('../models/snack')

var cats = []
Category.find({}, function (err, categories) {
    cats = categories
})

router.get('/', (req, res) => {
    var idSt = req.query.idShowtime;
    Showtime.findOne({ _id: idSt }, (err, st) => {
        Film.findOne({ _id: st.idFilm }, (err, fi) => {
            Ticket.find({ idShowtime: idSt }).sort({ sorting: 1 }).exec((err, tks) => {
                Category.find({}, (err, cats) => {
                    Room.findOne({ _id: st.idRoom }, (err, ro) => {
                        var allRows = [], rowA = [], rowB = [], rowC = [], rowD = [], rowE = [], rowF = [], rowG = [], rowH = [], rowJ = [], rowK = [];
                        tks.forEach(function (tk) {
                            if (tk.name.includes('A')) rowA.push(tk);
                            else if (tk.name.includes('B')) rowB.push(tk);
                            else if (tk.name.includes('C')) rowC.push(tk);
                            else if (tk.name.includes('D')) rowD.push(tk);
                            else if (tk.name.includes('E')) rowE.push(tk);
                            else if (tk.name.includes('F')) rowF.push(tk);
                            else if (tk.name.includes('G')) rowG.push(tk);
                            else if (tk.name.includes('H')) rowH.push(tk);
                            else if (tk.name.includes('J')) rowJ.push(tk);
                            else if (tk.name.includes('K')) rowK.push(tk);
                        })
                        if (rowJ.length != 0) allRows.push(rowA, rowB, rowC, rowD, rowE, rowF, rowG, rowH, rowJ, rowK);
                        else allRows.push(rowA, rowB, rowC, rowD, rowE, rowF, rowG, rowH, rowK);
                        Ticket.countDocuments({ idShowtime: idSt, available: 1 }, (err, countAvailable) => {
                            res.render('order/order-seat', {
                                nameEN: fi.nameEN,
                                nameVN: fi.nameVN,
                                date: st.date,
                                room: ro,
                                timeStart: st.timeStart,
                                countAvailable: countAvailable,
                                countAll: tks.length,
                                a: allRows,
                                cats: cats,
                                idSt: idSt
                            })
                        })
                    })
                })
            })
        })
    })
})

router.post('/reload', (req, res) => {
    var idSt = req.body.idShowtime;
    var typeRoom = req.body.typeRoom;
    var htmlSend = ``;
    Ticket.find({ idShowtime: idSt }).sort({ sorting: 1 }).exec((err, tks) => {
        var a = [], rowA = [], rowB = [], rowC = [], rowD = [], rowE = [], rowF = [], rowG = [], rowH = [], rowJ = [], rowK = [];
        tks.forEach(function (tk) {
            if (tk.name.includes('A')) rowA.push(tk);
            else if (tk.name.includes('B')) rowB.push(tk);
            else if (tk.name.includes('C')) rowC.push(tk);
            else if (tk.name.includes('D')) rowD.push(tk);
            else if (tk.name.includes('E')) rowE.push(tk);
            else if (tk.name.includes('F')) rowF.push(tk);
            else if (tk.name.includes('G')) rowG.push(tk);
            else if (tk.name.includes('H')) rowH.push(tk);
            else if (tk.name.includes('J')) rowJ.push(tk);
            else if (tk.name.includes('K')) rowK.push(tk);
        })
        if (rowJ.length != 0) a.push(rowA, rowB, rowC, rowD, rowE, rowF, rowG, rowH, rowJ, rowK);
        else a.push(rowA, rowB, rowC, rowD, rowE, rowF, rowG, rowH, rowK);
        Ticket.countDocuments({ idShowtime: idSt, available: 1 }, (err, countAvailable) => {
            if (typeRoom == 114) {
                for (var i = 0; i < a.length; i++) {
                    htmlSend = htmlSend + `<td class="td-order">`;
                    for (var j = 0; j < a[i].length; j++) {
                        if (i != 9) {
                            if (j == 1 || j == 9) {
                                htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" type="checkbox" price="${a[i][j].price}" name="ticket" value="` + a[i][j]._id + `" class="btn-check" id="btn-check-` + a[i][j].name + `"  autocomplete="off"` + ((a[i][j].available == 0) ? `disabled` : ``) + ` >
                                            <label class="btn btn-primary btn-seat" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>
                                            <input type="checkbox" class="btn-check" id="btn-check-a2"  autocomplete="off" disabled>
                                            <label class="btn btn-primary btn-seat" for="btn-check-a2" style="opacity: 0;"></label>`;
                            } else {
                                htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" price="${a[i][j].price}" type="checkbox" name="ticket" value="` + a[i][j]._id + `" class="btn-check" id="btn-check-` + a[i][j].name + `"  autocomplete="off" ` + ((a[i][j].available == 0) ? `disabled` : ``) + `>
                                            <label class="btn btn-primary btn-seat" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>`;
                            }
                        } else {
                            if (j == 0 || j == 4) {
                                htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" price="${a[i][j].price}" type="checkbox" name="ticket" value="` + a[i][j]._id + `" class="btn-check couple" id="btn-check-` + a[i][j].name + `"  autocomplete="off" ` + ((a[i][j].available == 0) ? `disabled` : ``) + `>
                                            <label class="btn btn-primary btn-couple btn-seat" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>
                                            <input type="checkbox" class="btn-check" id="btn-check-a2"  autocomplete="off" disabled>
                                            <label class="btn btn-primary btn-seat" for="btn-check-a2" style="opacity: 0;"></label>`;
                            } else {
                                htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" price="${a[i][j].price}" type="checkbox" name="ticket" value="` + a[i][j]._id + `" class="btn-check couple" id="btn-check-` + a[i][j].name + `"  autocomplete="off" ` + ((a[i][j].available == 0) ? `disabled` : ``) + `>
                                            <label class="btn btn-primary btn-couple btn-seat" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>`
                            }
                        }

                    }
                    htmlSend = htmlSend + `</td>`;
                }
            } else {
                for (var i = 0; i < a.length; i++) {
                    htmlSend = htmlSend + `<td class="td-order td-order-small">`;
                    for (var j = 0; j < a[i].length; j++) {
                        if (i != 8) {
                            htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" price="${a[i][j].price}" type="checkbox" name="ticket" value="` + a[i][j]._id + `" class="btn-check" id="btn-check-` + a[i][j].name + `"  autocomplete="off" ` + ((a[i][j].available == 0) ? `disabled` : ``) + `>
                                            <label class="btn btn-primary btn-seat btn-seat-small" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>`;
                        } else {
                            htmlSend = htmlSend + `<input onclick="orderSeatHandle(this)" price="${a[i][j].price}" type="checkbox" name="ticket" value="` + a[i][j]._id + `" class="btn-check couple" id="btn-check-` + a[i][j].name + `"  autocomplete="off" ` + ((a[i][j].available == 0) ? `disabled` : ``) + `>
                                            <label class="btn btn-primary btn-couple btn-seat btn-seat-small" for="btn-check-`+ a[i][j].name + `">` + a[i][j].name + `</label>`
                        }
                    }
                    htmlSend = htmlSend + `</td>`;
                }
            }
            res.send({
                htmlSend: htmlSend,
                countAvailable: countAvailable
            })
        })
    })
})

var snacklist = []
Snack.find({}, function (err, snacks) {
    snacklist = snacks
})

router.post('/ticket', (req, res) => {
    var{ticket,idSt} =req.body    
    var body = req.body    
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
    User.findOne({email : req.session.user},function(err,us){        
        Showtime.findById(idSt, function(err,st){
            Film.findById(st.idFilm, function(err,film){
                Room.findById(st.idRoom,function(err,room){
                    if (err) return console.log(err);
                    if(ticket=='string'){
                        Ticket.findById(ticket, function(err,tk){
                            let total=0
                            snackarr.forEach(item => {
                                total+=item.price*item.quantity
                            })
                            res.render('payment/detail-check',{
                                st:st,
                                tk:tk,
                                film:film,
                                room:room,
                                user:us,
                                snack:snackarr,
                                cats:cats,
                                totalticket:tk[0].price,
                                totalsn:total
                            })
                        })
                    }else{
                        Ticket.find({"_id": {"$in" : ticket}}, function(err, tk){
                            var totaltk=0
                            tk.forEach(ticket => {
                                totaltk+=ticket.price
                            })
                            var totalsn=0
                            snackarr.forEach(item => {
                                totalsn+=item.price*item.quantity
                            })    
                            res.render('payment/detail-check',{
                                st:st,
                                tk:tk,                                
                                film:film,
                                room:room,
                                user:us,
                                snack:snackarr,
                                cats:cats,
                                totalticket:totaltk,
                                totalsn:totalsn
                            })
                        })
                    }
                })
            })        
        })
    })    
})

router.post('/snack', (req, res) => {
    var{ticket,idSt} = req.body
    Snack.find({block:{'$ne':1}},async function(err,snacks){
        Ticket.find({"_id": {"$in" : ticket}}, function(err, tk){                 
            res.render('order/order-snack',{
                tk:tk,
                idst:idSt,
                snacks:snacks,
                cats:cats
            })
        })
    })
})

router.get('/uservoucher', (req,res) => {
    var {code} =req.query
    code=code.toUpperCase()
    var today = Date.now()    
    Voucher.findOne({code:code},function(err,voucher){
        var check=true
        if(voucher){
            voucher.user.forEach(user => {
                if(user==req.session.user){
                    check=false
                }
            })
            if(voucher.datefrom > today || voucher.dateto < today){
                check=false
            }
        }else{
            check=false
        }
        if(check){
            res.send({
                value:voucher.value,
                match:true
            })
        }else{
            res.send({                
                match:false
            })
        }
    })
   
})
module.exports = router;