var komunitateaModel =require('../model/komunitateaModel');
var storageModel =require('../model/storageModel');
var check = require('./isLoggedIn');

exports.index=function (req, res){

    check.isLoggedIn(req,res);

    komunitateaModel.index(req,res);
    //res.render('pages/storage', { erabiltzailea: 'iker', files: files });
}

exports.komunitateaSortu=(req, res)=>{

    check.isLoggedIn(req,res);

    if(!req.isAuthenticated()){
        req.flash('loginMessage', 'Autentikatu behar zera');
        res.redirect( '/');
    }


    komunitateaModel.komunitateaSortu(req,res);
    res.redirect('/komunitatea');
}
exports.komunitateaLortu=(req,res)=>{

    check.isLoggedIn(req,res);

    komunitateaModel.komunitateaLortu(req,res);
}

exports.fitxategiaIgo=(req,res)=>{

    check.isLoggedIn(req,res);

    komunitateaModel.fitxategiaIgo(req,res);
}
exports.deleteFile=(req,res)=>{

    check.isLoggedIn(req,res);

    komunitateaModel.deleteFile(req,res);
    res.redirect('/komunitatea/'+req.params.kom);
}
exports.deleteKom=(req,res)=>{

    check.isLoggedIn(req,res);

    komunitateaModel.deleteKom(req,res);
    res.redirect('/komunitatea');
}

exports.fitxategiaBistaratu=(req,res)=>{

    check.isLoggedIn(req,res);

    komunitateaModel.fitxategiaBistaratu(req,res);
}
exports.komentarioaGehitu=(req,res)=>{
    check.isLoggedIn(req,res);
    komunitateaModel.komentarioaGehitu(req,res);
    res.redirect('/komunitatea/'+req.params.kom);
}

exports.like=(req,res)=>{
    check.isLoggedIn(req,res);
    komunitateaModel.likeAldatu(req,res);
    res.redirect('/komunitatea/'+req.params.kom);
}

exports.dislike=(req,res)=>{
    check.isLoggedIn(req,res);
    komunitateaModel.dislikeAldatu(req,res);
    res.redirect('/komunitatea/'+req.params.kom);
}
