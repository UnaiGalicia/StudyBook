const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const usrSchema = new mongoose.Schema({     //user modeloa definitu

    email: { type: String, required: true },
    username: {type:String, required:true, unique:true},
    password: {type: String, required: true},
    izena: {type: String, required: true},
    abizena: {type: String, required: true},
    adina: {type: Number, required: true},
    mezua: {type: String, required: true},
    ikastetxea: {type: String, required: true},
})

usrSchema.methods.generateHash = function (password) {  //pasahitza zifratu DBan gorde baino lehen
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
}

usrSchema.methods.validatePass = function(password) {   //DBko pasahitza konparatu erabiltzaileak loginean sartu duenarekin
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', usrSchema); //modelo hau erabiltzen duen objetuak User izango dira :)