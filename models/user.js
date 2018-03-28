'use strict'

const mongoose = require('mongoose')
const mongooseApiQuery = require('mongoose-api-query')
const validate = require('mongoose-validator')
const createdModified = require('mongoose-createdmodified').createdModifiedPlugin

var documentIdValidator = [

  validate({
    validator: function (val) {
      var cpfTest = require('cpf_cnpj').CPF
      var cnpjTest = require('cpf_cnpj').CNPJ

      return cpfTest.isValid(val) || cnpjTest.isValid(val)
    }
  })
]

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  verification_code: {
    type: String
  },
  verification_code_date: {
    type: Date,
    default: Date.now()
  },
  documentId: {
    type: String,
    unique: true,
    validate: documentIdValidator
  },
  password: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed'],
    default: 'pending'
  }
}, { minimize: false })

UserSchema.plugin(mongooseApiQuery)
UserSchema.plugin(createdModified, { index: true })

const User = mongoose.model('User', UserSchema)
module.exports = User
