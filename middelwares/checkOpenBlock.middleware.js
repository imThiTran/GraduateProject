var User= require('../models/user');

module.exports = function(req,res,next){
    var today=new Date();
    User.updateMany({$or:[{"block.type":{$ne:0}},{"block.type":{$ne:-1}}] ,"block.dateto":{$lte:today}},{
        $set:{"block.type":0,"block.dateto":''},
        },function(err,result){
            next();
    })
}