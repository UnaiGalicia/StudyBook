const { Schema, model } = require('mongoose');

const prodSchema = new Schema({
    idFile: { type: String, trim: true, default: "", required: true, unique: true }, // filename
    owner: { type: String, trim: true, default: "", require: true }, // is a token
    name: { type: String, trim: true, default: "", require: true }, // name file + estension
    visibleToEveryone: { type: Boolean, default: true },
    type: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
    sizeFile: { type: Number, default: 0 }, // size in kb
    komunitatea: {type: String, required: false, default: ""},
    komentarioak: [{
        erabiltzailea:String,
        mezua:String,
    }],
    like:[String],
    dislike:[String],
    isImage:{type:Boolean,required:true,default:false},
    //img: {type: Boolean},
})

module.exports = prodSchema;