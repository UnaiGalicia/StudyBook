const { Schema, model } = require('mongoose');

const prodSchema = new Schema({
    izena:{type:String, required: true, unique:true},
    sortzailea:{type:String, required:true},
})

module.exports = prodSchema;