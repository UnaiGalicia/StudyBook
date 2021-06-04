const LocalStrategy = require('passport-local').Strategy; //Erregistratzeko modua. Hemen fcebook bidez erregistratu ahal gara berez, baina local jarriko dugu

const User = require('../model/user');

module.exports = function (passport) {  //Hau exportatzen dugu. Passport jasotzen dugu.
                                        //Gu logeatzean, passportek datuen sesio bat sortzen du, cookie bat
    passport.serializeUser(function(user, done){
        done(null, user.id);    //callback
    });

    passport.deserializeUser(function (id, done){   //id jaso eta callback jaso
        User.findById(id, function(err, user){  //datu basean bilatu...
            done(err, user);                             //emaitza bezala errorea edo bilatu dugun erabiltzailea lortu ditzakegu
        });
    });

    //SIGN UP
    //Zer egin erabiltzailea autentikatzean
    passport.use('local-signup', new LocalStrategy({     //ROUTETAN LOCAL-SIGNUP DEFINITU DUGU
        usernameField: 'username',                                 //eskeman horrela deitu dugu eremua
        passwordField: 'password',                              //eskeman horrela deitu dugu eremua
        passReqToCallback: true
    },
        function (req, usr, password, done){
            User.findOne({'username': usr}, async function(err, user){
                if(err) { return done(err);} //callbacka errorearekin bueltatu
                if(user){
                    return done(null, false, req.flash('signupMessage', 'Erabiltzaile-izen hori duen kontu bat dago'));      //signupMessage motako mezua bidali, eskuineko edukiarekin
                }
                else {
                    var newUser = new User();
                    newUser.email = req.body.email;
                    newUser.password = newUser.generateHash(password);
                    newUser.username = usr;
                    newUser.izena = req.body.izena;
                    newUser.adina = req.body.adina;
                    newUser.abizena = req.body.abizena;
                    newUser.mezua = req.body.mezua;
                    newUser.ikastetxea = req.body.ikastetxea;

                    await newUser.save(function (err){
                        if(err){throw err;}
                        return done(null,newUser);
                    });
                }
            })
        }));

    //LOGIN
    //Zer egin erabiltzailea autentikatzean
    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, usr, password, done){
            User.findOne({'username': usr}, function(err, user){
                if(err) { return done(err);}
                if(!user){
                    return done(null, false, req.flash('loginMessage', 'Ez dago email hori duen konturik'))
                }
                if(!user.validatePass(password)){   //erabiltzaileak pasahitza oker bat sartzen badu
                    return done(null, false, req.flash('loginMessage', 'Pasahitza okerra')) //ez dugu errorerik pasako (Null), ez dugu erabiltzaile eskemarik pasako (null), baina mezu bat pasako dugu gaizki sartu dula adierazteko
                }
                    return done(null, user);    //ondo badoa
            })
        }));
}