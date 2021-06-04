var perfilaModel =require('../model/perfilaModel');
var check = require('./isLoggedIn');


exports.index=function (req, res){
    check.isLoggedIn(req,res);
    perfilaModel.perfilaLortu(req,res);
}

exports.bilaketa=(req,res)=>{

    check.isLoggedIn(req,res);
    const kom = perfilaModel.komunitateaLortu(req,res);
    console.log(kom);
    perfilaController.bilaketa(req,res);

}

