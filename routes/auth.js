'use strict'

/**
* Module dependencies
**/

const _ = require('lodash')
const errors = require('restify-errors')

/**
* Model Schema
**/
const User = require('../models/user')

global.server.post('/auth', function (req, res, next) {
  let data = req.body || {}
  User.find({_id: data.id, password: data.password}, function (err, doc) {
    if (err) {
      global.log.error(err)
      return next(new errors.InternalError(err.message))
    }

    if (doc.length > 0) {
      let token = global.token.signToken({id: doc._id})
      res.send({'access_token': token})
      next()
    } else {
      res.send(null)
      next()
    }
  })
})
