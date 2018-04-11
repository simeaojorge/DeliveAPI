'use strict'

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secret = 'ComaComaCOMABacon!!!!###ComCheddar'

class AuthorizationMethods {
  signToken (json) {
    return jwt.sign(json, secret)
  }

  verifyToken (req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken

      jwt.verify(bearerToken, secret, (err, data) => {
        if (err) {
          res.send(403)
          next()
        } else {
          User.findById(data.id, (err, user) => {
            if (err) {
              res.send(403)
            } else {
              req.user = user
            }
            next()
          })
        }
      })
    } else {
      res.send(403)
      next()
    }
  }
}

module.exports = AuthorizationMethods
