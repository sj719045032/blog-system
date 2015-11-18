/**
 * Created by shijin on 2015/9/24.
 */
var settings = require('../settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

module.exports = function () {
    return new Db(settings.db, new Server(settings.host, settings.port, {safe: true, poolSize: 1}));
};