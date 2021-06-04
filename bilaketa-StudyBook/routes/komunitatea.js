var express =require('express');
var router=express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto'); //core node module that well use to give names to files

const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
var komunitatea_controller=require('../controllers/KomunitateaController');


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
router.get('/', komunitatea_controller.index);
router.post('/upload',komunitatea_controller.komunitateaSortu);
router.get('/:kom',komunitatea_controller.komunitateaLortu);
router.post('/upload/:kom', [upload.single('file'), komunitatea_controller.fitxategiaIgo]);
router.get('/files/:kom/:filename',komunitatea_controller.fitxategiaBistaratu);
router.delete('/files/:kom/:name',komunitatea_controller.deleteFile);
router.delete('/:kom',komunitatea_controller.deleteKom);
router.post('/:kom/:id',komunitatea_controller.komentarioaGehitu);
router.get('/like/:kom/:id',komunitatea_controller.like);
router.get('/dislike/:kom/:id',komunitatea_controller.dislike);

module.exports = router;