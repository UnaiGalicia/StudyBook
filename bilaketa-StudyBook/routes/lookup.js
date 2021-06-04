var express =require('express');
var router=express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto'); //core node module that well use to give names to files

const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
var lookup_controller = require('../controllers/lookupController');


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


router.post('/erab', lookup_controller.bilatuErab);
router.post('/kom', lookup_controller.bilatuKom);
router.get('/', lookup_controller.index);
router.get('/:erab',lookup_controller.bilatuErabKanpotik);


module.exports = router;