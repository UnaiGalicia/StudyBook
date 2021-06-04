const mongoose = require('mongoose');
const crypto = require('crypto');
const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
const userModel = require('./user');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const userModel1 = require('./user');
const userModel2 = require('./KomDesc');

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


exports.perfilaLortu=(req,res)=>{
    const usr=req.user.username;
    userModel.findOne({username:usr}, (err, userMDL) => {
        //check if files
        if(!userMDL || userMDL.length === 0 ){                                                       //THIS IS THE FILES VARIABLES THAT IS CHECKED IN EJS
            res.render('pages/perfila', {erabiltzailea:false});
        }                                 // IN /views/index.ejs FILES WILL BE RENDERED AS FALSE
        else {
            res.render('pages/perfila', {erabiltzailea:usr, datuak:userMDL});
        }
    })
}

