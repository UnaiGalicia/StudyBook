var express = require('express');
var router = express.Router();
var erab="";
const check = require('../controllers/isLoggedIn');

/* GET home page. */
router.get('/', function(req, res, next) {
  check.isNotLoggedIn(req, res);
  res.render('pages/index', {message: req.flash('loginMessage'), title: 'Express' });
});

router.get('/sortu', function(req, res, next) {
  res.render('pages/sortu', {message: req.flash('signupMessage'), title: 'Express' });
});

router.get('/gara', function(req, res, next) {
  res.render('pages/gara', { title: 'Express' });
});

router.get('/user', function(req, res, next) {
  check.isLoggedIn(req, res);
  erab=req.query.erabiltzailea;
  res.render('pages/user', { erabiltzailea: req.user.username , message: req.flash('loginMessage')});
});

router.get('/kontaktua', function(req, res, next) {
  res.render('pages/kontaktua', { title: 'Express' });
});

router.get('/jarraituInstagram', function(req, res, next) {
  res.render('pages/jarraituInstagram', { title: 'Express' });
});

module.exports = router;
