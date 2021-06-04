var express =require('express');
var router=express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto'); //core node module that well use to give names to files

const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
var storage_controller=require('../controllers/storageController');


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

const upload = multer({ storage });

router.get('/', storage_controller.bezeroarenFitxategiak);
router.post('/upload', [upload.single('file'), storage_controller.fitxategiaIgo]);
router.get('/files/:filename',storage_controller.fitxategiaBistaratu);
router.delete('/files/:name',storage_controller.deleteFile);
router.post('/files/makePublic/:id', storage_controller.publikoaEgin);
router.get('/image/:filename', storage_controller.irudiakJSON);

module.exports = router;