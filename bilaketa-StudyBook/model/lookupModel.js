const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const FileDesc = require('./FileDesc');
const userModel1 = require('./user');
const userModel2 = require('./KomDesc');

const db = mongoose.connection;

let gfs; //Variable for gfs stream

db.once('open',  () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');      //which collection
})



exports.bilatuErab=(req,res)=>{
    const usr=req.user.username;
    const query=req.body.query;

    if(query === usr)   //tontoa baldin bazea
        res.redirect('/storage')
   // const mdl = mongoose.model('usrDesc', userModel1, 'users');
    userModel1.findOne({username:query}, (err, userMDL) => {
        //check if files
        if(!userMDL || userMDL.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            req.flash('loginMessage', 'Ez dago erabiltzaile izen hori duen erabiltzailerik :(')
            res.redirect('/user');
        }                                                                                            // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {
            const colName = 'File'+query;                                                            //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
            const mdl = mongoose.model('FileDesc', FileDesc, colName);
            mdl.find({owner: query}, (err, files) => {
                //check if files
                if(!files || files.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
                    res.render('pages/bilaketa', {login: usr, erabiltzailea: userMDL, komunitatea:false, files:false});   }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
                else {
                    let i = 0;
                    if(usr !== query) {
                        while (i < files.length) {
                            if (files[i].visibleToEveryone === false)
                                files.splice(i, 1);
                            else
                                ++i;
                        }
                        res.render('pages/bilaketa', {login:usr, erabiltzailea:userMDL, komunitatea:false, files: files});

                    }


                }

            })
        }
    })
}

exports.bilatuErabKanpotik=(req,res)=>{
    const usr=req.user.username;
    const query=req.params.erab;

    if(query === usr)   //tontoa baldin bazea
        res.redirect('/storage')
    // const mdl = mongoose.model('usrDesc', userModel1, 'users');
    userModel1.findOne({username:query}, (err, userMDL) => {
        //check if files
        if(!userMDL || userMDL.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            req.flash('loginMessage', 'Ez dago erabiltzaile izen hori duen erabiltzailerik :(')
            res.redirect('/user');
        }                                                                                            // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {
            const colName = 'File'+query;                                                            //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
            const mdl = mongoose.model('FileDesc', FileDesc, colName);
            mdl.find({owner: query}, (err, files) => {
                //check if files
                if(!files || files.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
                    res.render('pages/bilaketa', {login: usr, erabiltzailea: userMDL, komunitatea:false, files:false});   }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
                else {
                    let i = 0;
                    if(usr !== query) {
                        while (i < files.length) {
                            if (files[i].visibleToEveryone === false)
                                files.splice(i, 1);
                            else
                                ++i;
                        }
                        res.render('pages/bilaketa', {login:usr, erabiltzailea:userMDL, komunitatea:false, files: files});

                    }


                }

            })
        }
    })
}

exports.bilatuKom=(req,res)=>{
    const usr=req.user.username;
    const query=req.body.query;


    const mdl = mongoose.model('KomDesc', userModel2, 'Kom');
    mdl.findOne({izena:query}, (err, komMDL) => {
        //check if files
        if (!komMDL || komMDL.length === 0) {                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            req.flash('loginMessage', 'Ez dago komunitate izen hori duen komunitaterik :(')
            res.redirect('/user');
        } else {
            res.redirect('/komunitatea/' + query);
        }
    })
/*
            const colName = 'File'+query;                                                            //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
            const mdl = mongoose.model('FileDesc', FileDesc, colName);
            mdl.find( {},(err, files) => {
                //check if files
                if(!files || files.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
                    res.render('pages/bilaketa', {login:usr, erabiltzailea: false, komunitatea: komMDL, files:false});   }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
                else {
                    res.render('pages/bilaketa', {login:usr, erabiltzailea: false, komunitatea: komMDL, files: files});
                    console.log(files)
                }

            })

        }
    })*/
}