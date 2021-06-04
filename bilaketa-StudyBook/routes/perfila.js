var express =require('express');
var router=express.Router();

var perfila_controller=require('../controllers/PerfilaController');

router.get('/', perfila_controller.index);
router.get('/bilaketa/erab/:usr',perfila_controller.bilaketa);


module.exports = router;