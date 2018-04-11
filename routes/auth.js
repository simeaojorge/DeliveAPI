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
  User.findOne({_id: data.id, password: data.password}, function (err, doc) {
    if (err) {
      global.log.error(err)
      res.send(403)
    } else if (typeof doc !== 'undefined') {
      let token = global.token.signToken({id: doc.id})
      res.send({'access_token': token})
    } else {
      res.send(403)
    }
    next()
  })
})

global.server.get('/auth', global.token.verifyToken, (req, res, next) => {
  res.send(200, req.user)
  next()
})
