var lookupModel =require('../model/lookupModel');
var check = require('./isLoggedIn');


exports.index=function (req, res){
    check.isLoggedIn(req,res);
    res.redirect('/user');
}

exports.bilatuKom = (req, res) => {

    check.isLoggedIn(req,res);
    lookupModel.bilatuKom(req, res);

}

exports.bilatuErab = (req, res) => {

    check.isLoggedIn(req, res);
    lookupModel.bilatuErab(req, res);

}
exports.bilatuErabKanpotik = (req, res) => {

    check.isLoggedIn(req, res);
    lookupModel.bilatuErabKanpotik(req, res);

}