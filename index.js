'use strict'

/**
 * Module Dependencies
 */
const config = require('./config')
const restify = require('restify')

const bunyan = require('bunyan')
const Auth = require('./app/auth')
const restifyPlugins = require('restify').plugins
const winston = require('winston')
const bunyanWinston = require('bunyan-winston-adapter')
const mongoose = require('mongoose')
const i18n = require('i18n')

/**
 * Logging
 */
global.log = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: () => {
        return new Date().toString()
      },
      json: true
    })
  ]
})

global.token = new Auth()

/**
* Internationalization
*/
i18n.configure({

  locales: ['en', 'pt-br'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'lang'
})

/**
 * Initialize Server
 */
global.server = restify.createServer({
  name: config.name,
  version: config.version,
  log: bunyanWinston.createAdapter(global.log)
})

/**
 * Middleware
*/
global.server.use(restifyPlugins.bodyParser({ mapParams: true }))
global.server.use(restifyPlugins.acceptParser(global.server.acceptable))
global.server.use(restifyPlugins.queryParser({ mapParams: true }))
global.server.use(restifyPlugins.fullResponse())
global.server.use(i18n.init)

/**
 * Error Handling
 */
global.server.on('uncaughtException', (req, res, route, err) => {
  global.log.error(err.stack)
  res.send(err)
})

/**
 * Lift Server, Connect to DB & Bind Routes
 */
global.server.listen(config.port, () => {
  mongoose.connection.on('error', function (err) {
    global.log.error('Mongoose default connection error: ' + err)
    process.exit(1)
  })

  mongoose.connection.on('open', function (err) {
    if (err) {
      global.log.error('Mongoose default connection error: ' + err)
      process.exit(1)
    }

    global.log.info(
      '%s v%s ready to accept connections on port %s in %s environment.',
      global.server.name,
      config.version,
      config.port,
      config.env
    )

    require('./routes')
  })

  global.db = mongoose.connect(config.db.uri)
})
