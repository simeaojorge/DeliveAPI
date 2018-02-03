'use strict'

const mongoose = require('mongoose'),
      mongooseApiQuery = require('mongoose-api-query'),
      validate = require('mongoose-validator'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin,
      schema = mongoose.Schema;



const LocationSchema = new mongoose.Schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: [Number],
        index: '2d'
    },
}, { minimize: false });

LocationSchema.plugin(mongooseApiQuery)
LocationSchema.plugin(createdModified, { index: true })

class LocationClass{
    
    static findLocation(req, res, next) {  
        var limit = req.query.limit || 10;

        // get the max distance or set it to 8 kilometers
        var maxDistance = req.query.distance || 8;

        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistance /= 6371;

        // get coordinates [ <longitude> , <latitude> ]
        var coords = [];
        coords[0] = req.query.longitude;
        coords[1] = req.query.latitude;

        // find a location
        Location.find({
          loc: {
            $near: coords,
            $maxDistance: maxDistance
          }
        }).limit(limit).exec(function(err, locations) {
          if (err) {
            return res.json(500, err);
          }

          res.json(200, locations);
        });
    }
}

LocationSchema.loadClass(LocationClass)
const Location = mongoose.model('Location', LocationSchema)
module.exports = Location