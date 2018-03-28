'use strict'

/**
* Module dependencies
**/

const _ = require('lodash')
const errors = require('restify-errors')
const Sms = require('../app/sms/sms')
const crypto = require('crypto')

/**
* Model Schema
**/
const User = require('../models/user')

global.server.post('/users', function (req, res, next) {
  let data = req.body || {}

  let hash = new Date()
  hash = hash.getTime().toString()
  hash = crypto.createHash('md5').update(hash).digest('hex')

  data.verification_code = hash.substr(-4)

  let user = new User(data)
  user.save(function (err) {
    if (err) {
      console.error(err)
      return next(new errors.InternalError(err.message))
    }

    const sms = new Sms()
    try {

      // sms.send(data.phone_number, `Seu código de verificação é ${data.verification_code}`);
    } catch (error) {
      return next(new errors.InternalError(error.message))
    }

    res.send(201, data)
    next()
  })
})

/**
 * LIST
 */
global.server.get('/users', function (req, res, next) {
  User.apiQuery(req.params, function (err, docs) {
    if (err) {
      global.log.error(err)
      return next(new errors.InvalidContentError(err.message))
    }

    res.send(docs)
    next()
  })
})

/**
 * GET
 */
global.server.get('/users/:user_id', function (req, res, next) {
  User.findOne({ _id: req.params.user_id }, function (err, doc) {
    if (err) {
      global.log.error(err)
      return next(new errors.InvalidContentError(err.message))
    }

    res.send(doc)
    next()
  })
})

global.server.get('/users/:user_phone_number', function (req, res, next) {
  User.findOne({ phone_number: req.params.user_phone_number }, function (err, doc) {
    if (err) {
      global.log.error(err)
      return next(new errors.InvalidContentError(err.message))
    }

    res.send(doc)
    next()
  })
})

/**
 * UPDATE
 */
global.server.put('/users/:user_id', function (req, res, next) {
  let data = req.body || {}

  if (!data._id) {
    _.extend(data, {
      _id: req.params.user_id
    })
  }

  User.findOne({ _id: req.params.user_id }, function (err, doc) {
    if (err) {
      global.log.error(err)
      return next(new errors.InvalidContentError(err.message))
    } else if (!doc) {
      return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'))
    }

    User.update({ _id: data._id }, data, function (err) {
      if (err) {
        global.log.error(err)
        return next(new errors.InvalidContentError(err.message))
      }

      res.send(200, data)
      next()
    })
  })
})

/**
 * DELETE
 */
global.server.del('/users/:user_id', function (req, res, next) {
  User.remove({ _id: req.params.user_id }, function (err) {
    if (err) {
      global.log.error(err)
      return next(new errors.InvalidContentError(err.message))
    }

    res.send(204)
    next()
  })
})
