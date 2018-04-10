'use strict'

const jwt = require('jsonwebtoken')
const secret = 'ComaComaCOMABacon!!!!###ComCheddar'

class AuthorizationMethods {
  signToken (json) {
    return jwt.sign(json, secret)
  }

  verifyToken (req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {

    } else {
      res.send(403)
    }
  }
}

module.exports = AuthorizationMethods
