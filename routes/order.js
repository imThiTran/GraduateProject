var express = require('express');
var router = express.Router();
var Ticket = require('../models/ticket');
var Film = require('../models/film');
var Showtime = require('../models/showtime');
var Category = require('../models/category');

router.get('/',(req,res)=>{
    var idSt=req.query.idShowtime;
    Showtime.findOne({_id:idSt},(err,st)=>{
        Film.findOne({_id:st.idFilm},(err,fi)=>{
            Ticket.find({idShowtime:idSt}).sort({sorting:1}).exec((err,tks)=>{
                Category.find({},(err,cats)=>{
                var allRows=[],rowA=[],rowB=[],rowC=[],rowD=[],rowE=[],rowF=[],rowG=[],rowH=[],rowJ=[],rowK=[];
                tks.forEach(function(tk){
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
                allRows.push(rowA,rowB,rowC,rowD,rowE,rowF,rowG,rowH,rowJ,rowK);
                Ticket.countDocuments({idShowtime:idSt,available:1},(err,countAvailable)=>{
                res.render('order/order-seat',{
                    nameEN:fi.nameEN,
                    nameVN:fi.nameVN,
                    date:st.date,
                    room:st.room,
                    timeStart:st.timeStart,
                    countAvailable:countAvailable,
                    countAll:tks.length,
                    a:allRows,
                    cats:cats
                        })
                    })
                })
            })
        })
    })
})

module.exports = router;