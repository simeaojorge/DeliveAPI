'use strict'

module.exports = {
  name: 'API',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  base_url: process.env.BASE_URL || 'http://localhost:3000',
  db: {
    uri: 'mongodb://delive:rootdeliveadmin@cluster0-shard-00-00-6h9ki.mongodb.net:27017,cluster0-shard-00-01-6h9ki.mongodb.net:27017,cluster0-shard-00-02-6h9ki.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
    // uri: 'mongodb://delive:rootdeliveadmin@cluster0-6h9ki.mongodb.net/test'
  }
}
