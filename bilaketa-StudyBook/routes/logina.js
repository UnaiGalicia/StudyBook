var express =require('express');
var router=express.Router();
var passport=require('passport');

    router.post('/', passport.authenticate('local-login', {       //req eta res beharrean passport.authenticate
        successRedirect: '/user',
        failureRedirect: '/',
        failureFlash: true
    }));

    router.post('/signup', passport.authenticate('local-signup', { //req eta res beharrean, passportekin signup-a egin nahi dugu
        successRedirect: '/user',
        failureRedirect: '/sortu',
        failureFlash: true
    }));
    
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })


    router.get('/error/unauthorized', (req, res) => {
        res.render('error')
    })
module.exports = router;