const mongoose = require('mongoose');
const FileDesc = require('./FileDesc');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
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
    gfs.files.find().toArray((err, files) => {
        //check if files
        if (!files || files.length === 0) {                                                      //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            res.render('index', {files: false});                                     // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        } else {
            files.map(file => {                                                                 //THIS WILL MAP THE ARRAY FILES TO MARK FILES THAT ARE PNG OR JPEG SO THAT EJS CAN SAY OK THIS IS AN IMAGE, I WILL DISPLAY IT
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('pages/storage', {erabiltzailea:req.user.username,files: files});
        }
    });
};

exports.fitxategiaBistaratu=(req,res)=>{
    //find file
    const colName = 'File'+req.user.username;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.filename}, (err, obj) => {
        console.log(obj);
        if(obj.visibleToEveryone === false && obj.owner!== req.user.username ) //Horrela, URLarekin ez du zentzurik. Izan ere urlko usr beti izango delako fitxategiari dagokiona
            //BALDINTZA ALDATU
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

exports.deleteFile=(req,res)=>{
    const colName = 'File'+req.user.username;   //usr-n jaso erabiltzailearen izena!!!!!!!!!!!!!
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.remove({owner: req.user.username, _id: req.params.name}, (err, files) => {     //Zentzua izan dezake. baina erabiltzaile batek izen bereko fitxategi bat izan ahalko du
        //check if files
        if(err){
            return res.status(404).json({err: err})
        }

        gfs.remove({ _id:req.params.name , root: 'uploads'}, (err, gridStore) => {                     //Honek bai ez duela zentzurik. grideko ida FileUsername egiturarekin lotu behar da!!
            if(err){
                return res.status(404).json({err: err})
            }
        }); //collection in root!!
    });
    
}

exports.irudiakJSON=(req,res)=>{
    gfs.files.findOne({_id: req.params.filename}, (err, file) => {
        if(!file || file.length === 0 ){
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        //We want to check if its an image
        if(file.contentType == 'image/jpeg' || file.contentType == 'image/png') {
            const readstream = gfs.createReadStream(file.filename);            //If it is an image, we want to output the image
            readstream.pipe(res);                                               //the response will be the data of the imaegs, from the chunks
        }
        else
            res.status(404).json({err: 'not an image'});

    })
}

//Allfiles/:usr
exports.bezeroarenFitxategiak=(req,res)=>{
    
    const usr=req.user.username;
    const colName = 'File'+usr;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.find({owner: usr}, (err, files) => {
        //check if files
        if(!files || files.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            res.render('pages/storage', {erabiltzailea:usr,files:false});   }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {

            res.render('pages/storage', {erabiltzailea:usr,files: files});
            console.log(files)
        }

    })
}

exports.bezoarenFitxDeskarga=(req,res)=>{
    const usr=req.user.username;
    const colName = 'File'+usr;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.filename}, (err, obj) => {
        console.log(obj);
        if(obj.visibleToEveryone === false && usr !== obj.owner) //Horrela, URLarekin ez du zentzurik. Izan ere urlko usr beti izango delako fitxategiari dagokiona
            return res.status(404).json({
                err: 'Not allowed'
            });
        else {
            gfs.files.findOne({_id: obj._id}, (err, file) => {
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

exports.publikoEgin = async(req, res) => {

    const usr=req.user.username;
    const colName = 'File'+usr;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
    const mdl = mongoose.model('FileDesc', FileDesc, colName);
    mdl.findOne({_id: req.params.id}, async (err, obj) => {
        if (usr !== obj.owner) //Horrela, URLarekin ez du zentzurik. Izan ere urlko usr beti izango delako fitxategiari dagokiona
            return res.status(404).json({
                err: 'Not allowed'
            });

        if (obj.visibleToEveryone) {
            obj.visibleToEveryone = false;
            await obj.save();
            res.redirect('/storage')

        } else {
            obj.visibleToEveryone = true;
            await obj.save();
            res.redirect('/storage')
        }
    });
}

exports.fitxategiaIgo=async(req,res)=>{
    console.log(req.body.visibleToEveryone + '##########');
    const usr=req.user.username;
    let vsbl = false;
    const colName = 'File'+usr;   //example-n jaso erabiltzailearen izena, horrekin kolekzio bat sortzeko
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

    if(req.body.visibleToEveryone === 'on')
        vsbl = true;

    const p = new mdl({     //p sortzean jun betetzen erabiltzailearen gauzekin: Owner...
        idFile: token,
        owner: usr,
        name: req.file.filename,
        visibleToEveryone: vsbl,
        type: req.file.mimetype,
        sizeFile: req.file.size,
        likes: 0,
        komunitatea:"",
        isImage: irudia,
        // img: img
    })

    await p.save((err, document) => {
        if(err) console.log(err); //Errorea badago erakutsi kontsolan
    })

    //res.redirect('/');
    res.redirect('/storage');
}
