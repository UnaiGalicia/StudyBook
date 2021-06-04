const mongoose = require('mongoose');
const KomDesc = require('./KomDesc');
const crypto = require('crypto');
const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
const FileDesc = require('./FileDesc');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


const db = mongoose.connection;

let gfs; //Variable for gfs stream

db.once('open',  () => {
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');      //which collection
})

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {  //randombytes gives us rndom name
                if (err) {
                    return reject(err);
                }
                const filename = file.originalname;/*buf.toString('hex') +*/ //path.extname(file.originalname); //if there isnt error well create the file name with the original extension
                const fileInfo = {
                    filename: filename,     //filename: file.originalname
                    bucketName: 'uploads'   //matching the collection name
                };
                resolve(fileInfo);
            });
        });
    }
});


exports.index = (req,res)=>{
    const usr=req.user.username;
    const colName='Kom';
    const mdl = mongoose.model('KomDesc', KomDesc, colName);
    mdl.find({}, (err, komunitateak) => {
        if(!komunitateak || komunitateak.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            res.render('pages/komunitatea', {erabiltzailea:usr,komunitateak:false, kom:false});   }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {
            res.render('pages/komunitatea', {erabiltzailea:usr,komunitateak: komunitateak, kom:false});
        }
    })
}

exports.komunitateaSortu=async(req,res)=>{
    const usr=req.user.username;
    const izena=req.body.izena;
    console.log(req.body);
    const colName='Kom';
    const mdl = mongoose.model('KomDesc', KomDesc, colName);
    const p = new mdl({     //p sortzean jun betetzen erabiltzailearen gauzekin: Owner...
        izena:izena,
        sortzailea:usr,
        // img: img
    })

    await p.save((err, document) => {
        if(err) console.log(err); //Errorea badago erakutsi kontsolan
    })
}

exports.komunitateaLortu=(req,res)=>{
    const komIzena=req.params.kom;
    const usr=req.user.username;
    console.log(komIzena);
    const colName = 'File'+komIzena;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.find({komunitatea: komIzena}, (err, komun) => {
        //check if files
        if(!komun || komun.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            res.render('pages/storageKom', {erabiltzailea:usr, kom:false,komIzena:komIzena});
        }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {
            res.render('pages/storageKom', {erabiltzailea:usr, kom:komun,komIzena:komIzena});
        }
    })
}

exports.fitxategiaIgo=async(req,res)=>{
    console.log(req.file.filename)
    const usr=req.user.username;
    const kom=req.params.kom;
    console.log('Komizena:'+kom);
    const colName = 'File'+kom;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    /*    let img = false;
        if(req.file.contentType === 'image/jpeg' || req.file.contentType === 'image/png')
            img = true;*/
    var token = crypto.randomBytes(16).toString('hex');
    var irudia=false;
    if(req.file.contentType === 'image/jpeg' || req.file.contentType === 'image/png') {
        irudia = true;
    }
    else {
        irudia = false;
    }
    const p = new mdl({     //p sortzean jun betetzen erabiltzailearen gauzekin: Owner...
        idFile: token,
        owner: usr,
        name: req.file.filename,
        visibleToEveryone: true,
        type: req.file.mimetype,
        sizeFile: req.file.size,
        likes: 0,
        komunitatea:kom,
        isImage: irudia,
        // img: img
    })

    await p.save((err, document) => {
        if(err) console.log(err); //Errorea badago erakutsi kontsolan
    })

    //res.redirect('/');
    res.redirect('/komunitatea/'+kom);
}
exports.deleteFile=(req,res)=>{
    console.log('hey')
    const colName = 'File'+req.params.kom;   //usr-n jaso erabiltzailearen izena!!!!!!!!!!!!!
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.remove({owner: req.user.username, name: req.params.name}, (err, files) => {     //Zentzua izan dezake. baina erabiltzaile batek izen bereko fitxategi bat izan ahalko du
        //check if files
        if(err){
            return res.status(404).json({err: err})
        }

        gfs.remove({ filename:req.params.name , root: 'uploads'}, (err, gridStore) => {                     //Honek bai ez duela zentzurik. grideko ida FileUsername egiturarekin lotu behar da!!
            if(err){
                return res.status(404).json({err: err})
            }
        }); //collection in root!!
    });

}
exports.deleteKom=(req,res)=>{
    const usr = req.user.username;
    const colName = 'Kom';
    console.log('usr:'+usr+'kom:'+req.params.kom);
    const mdl = mongoose.model('KomDesc', KomDesc, colName);
    mdl.remove({izena: req.params.kom, sortzailea: usr}, (err, files) => {     //Zentzua izan dezake. baina erabiltzaile batek izen bereko fitxategi bat izan ahalko du
        //check if files
        if(err){
            return res.status(404).json({err: err})
        }else{
            db.dropCollection('File'+req.params.kom);
        }
    });
}

exports.fitxategiaBistaratu=(req,res)=>{
    //find file
    const colName = 'File'+req.params.kom;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.filename}, (err, obj) => {
        console.log(obj);
        if(obj.visibleToEveryone === false) //Horrela, URLarekin ez du zentzurik. Izan ere urlko usr beti izango delako fitxategiari dagokiona
            return res.status(404).json({
                err: 'Not allowed'
            });
        else {
            gfs.files.findOne({filename: obj.name}, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                }
                //   if (file.contentType !== 'image/jpeg' && file.contentType !== 'image/png') {
                const readstream = gfs.createReadStream(file.filename);            //If it is not an image, we want to get the chunks of the file
                readstream.pipe(res);                                              //And return the chunks, what will trigger the download
                //   } else
                //       res.status(404).json({err: 'not an image'});
            });
        }
    });
}

exports.komentarioaGehitu=(req,res)=>{
    console.log("hemen:"+req.body.komentarioa+' fitxategia:'+req.params.id +req.user.username);
    const usr= req.user.username;
    const koment_berria = {
        erabiltzailea: usr,
        mezua: req.body.komentarioa,
    }
    const colName = 'File'+req.params.kom;
    console.log('colName:'+colName);//example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    const doc =  mdl.findByIdAndUpdate(
        {_id: req.params.id},
        {$push: { komentarioak: koment_berria }},{safe: true, upsert: true},function (error, success) {
            if (error) {
                console.log('Errorea'+error);
            } else {
                console.log('ondo:'+success);
            }});

}

exports.likeAldatu=(req,res)=>{
    const usr= req.user.username;
    const colName = 'File'+req.params.kom;
    console.log('colName:'+colName);//example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.id}, function (error, file) {
            if (error) {
                console.log('Errorea'+error);
            } else {
                if(file.dislike.indexOf(usr)!==-1) {
                                    //like kendu
                    const index = file.dislike.indexOf(usr);
                    if (index > -1) {
                    file.dislike.splice(index, 1);
                    }
                }
                console.log(file);
                console.log('Lehengo:'+file.owner+file.like);
                console.log(file.like.indexOf(usr));
                if(file.like.indexOf(usr)===-1) {
                    //hacer push
                    console.log('hemen');
                    file.like.push(usr);
                }else{
                    //like kendu
                    const index = file.like.indexOf(usr);
                    if (index > -1) {
                        file.like.splice(index, 1);
                    }

                }
                console.log('Ondoren:'+file.like);
                file.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                });
            }}
    );
}

exports.dislikeAldatu=(req,res)=>{
    const usr= req.user.username;
    const colName = 'File'+req.params.kom;
    console.log('colName:'+colName);//example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.id}, function (error, file) {
            if (error) {
                console.log('Errorea'+error);
            } else {
                if(file.like.indexOf(usr)!==-1) {
                    //like kendu
                   const index = file.like.indexOf(usr);
                    if (index > -1) {
                       file.like.splice(index, 1);
                        }
                 }
                console.log(file);
                console.log('Lehengo:'+file.owner+file.dislike);
                console.log(file.dislike.indexOf(usr));
                if(file.dislike.indexOf(usr)===-1) {
                    //hacer push
                    console.log('hemen');
                    file.dislike.push(usr);
                }else{
                    //like kendu
                    const index = file.dislike.indexOf(usr);
                    if (index > -1) {
                        file.dislike.splice(index, 1);
                    }

                }
                console.log('Ondoren:'+file.dislike);
                file.save(function (err) {
                    if(err) {
                        console.error('ERROR!');
                    }
                });
            }}
    );
}