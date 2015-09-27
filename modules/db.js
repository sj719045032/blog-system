/**
 * Created by shijin on 2015/9/24.
 */
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = function () {
    return new Db(settings.db, new Server(settings.host, '27017', {safe: true, poolSize: 1}));
}