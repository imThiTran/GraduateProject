var express= require('express');
var router=express.Router();


//loai bo khoang trang trong chuoi
function cleanText(text){
    return text.replace(/\s+/g,' ').trim();
}

router.get('/',(req,res)=>{
    res.render('admin/admin-event')
})


module.exports= router;