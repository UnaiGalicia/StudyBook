var storageModel =require('../model/storageModel');
var check = require('./isLoggedIn');


exports.index=function (req, res){
    check.isLoggedIn(req,res);
   storageModel.index(req,res);
}

exports.fitxategiaIgo=(req, res)=>{
    check.isLoggedIn(req,res);
    storageModel.fitxategiaIgo(req,res);
}

exports.fitxategiaBistaratu=(req,res)=>{
    check.isLoggedIn(req,res);
    storageModel.fitxategiaBistaratu(req,res);
}
exports.deleteFile=(req,res)=>{
    check.isLoggedIn(req,res);
    storageModel.deleteFile(req,res);
    res.redirect('/storage');
}
exports.irudiakJSON=(req,res)=>{
    check.isLoggedIn(req,res);
    storageModel.irudiakJSON(req,res);
}

exports.bezeroarenFitxategiak=(req,res)=>{
    check.isLoggedIn(req,res);
    storageModel.bezeroarenFitxategiak(req,res);
}

exports.publikoaEgin = (req, res) => {
    check.isLoggedIn(req,res);
    storageModel.publikoEgin(req,res);
}
