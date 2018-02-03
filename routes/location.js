'use strict'

/**
* Module dependencies
**/

const   _           = require('lodash'),
        errors      = require('restify-errors')

/**
* Model Schema
**/
const Location = require('../models/location')

server.post('/location', function(req, res, next) {

    let data = req.body || {}

    let location = new Location(data)
    location.save(function(err) {

        if (err) {
            log.error(err)
            return next(new errors.InternalError(err.message))
            next()
        }

        res.send(201, data)
        next()

    })

})


/**
 * LIST
 */
server.get('/locations', function(req, res, next) {


    Location.apiQuery(req.params, function(err, docs) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.message))
        }

        res.send(docs)
        next()

    })

})


/**
 * GET
 */
server.get('/locations/:location_id', function(req, res, next) {

    Location.findOne({ _id: req.params.location_id }, function(err, doc) {

        if (err) {
            log.error(err)
            return next(new errors.InvalidContentError(err.message))
        }

        res.send(doc)
        next()

    })

})


/**
 * UPDATE
 */
server.put('/locations/:location_id', function(req, res, next) {

    let data = req.body || {}

    if (!data._id) {
		_.extend(data, {
			_id: req.params.location_id
		})
	}

    Location.findOne({ _id: req.params.location_id }, function(err, doc) {

		if (err) {
			log.error(err)
			return next(new errors.InvalidContentError(err.message))
		} else if (!doc) {
			return next(new errors.ResourceNotFoundError('The resource you requested could not be found.'))
		}

		Location.update({ _id: data._id }, data, function(err) {


			if (err) {
				log.error(err)
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
server.del('/locations/:location_id', function(req, res, next) {

    Location.remove({ _id: req.params.location_id }, function(err) {

		if (err) {
			log.error(err)
			return next(new errors.InvalidContentError(err.message))
		}

		res.send(204)
        next()

	})

})