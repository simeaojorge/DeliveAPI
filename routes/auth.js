'use strict'

/**
* Module dependencies
**/

const   _           = require('lodash'),
        errors      = require('restify-errors')

/**
* Model Schema
**/
const User = require('../models/user')
const jwt  = require('jsonwebtoken')
const secret = 'ComaComaCOMABacon!!!!###ComCheddar'

server.post('/auth', function(req, res, next) {

    let data = req.body || {}

    let user = new User(data)
    User.find({email: user.email, password: user.password}, function(err, doc) {

        if (err) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        if(doc.length > 0){
            let token = jwt.sign({id: doc._id}, secret)
            res.send({"access_token": token})
            next()
        }
        else{
            res.send(null)
            next()
        }
    })

})