'use strict'

const mongoose = require('mongoose'),
      mongooseApiQuery = require('mongoose-api-query'),
      validate = require('mongoose-validator'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

var documentIdValidator = [

    validate({
        validator: function(val){

            var cpfTest = require('cpf_cnpj').CPF;
            var cnpjTest = require('cpf_cnpj').CNPJ;

            return cpfTest.isValid(val) || cnpjTest.isValid(val);
        }
    })
];

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    documentId: {
        type: String,
        required: true,
        unique: true,
        validate: documentIdValidator
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'completed']
    },
}, { minimize: false });

UserSchema.plugin(mongooseApiQuery)
UserSchema.plugin(createdModified, { index: true })

const User = mongoose.model('User', UserSchema)
module.exports = User