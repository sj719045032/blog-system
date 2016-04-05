#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('untitled4:server');
var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
if (cluster.isMaster) {
    for (var i = 0; i < 2; i++) {
        cluster.fork();
    }
    cluster.on('fork', function (worker, code, signal) {
        console.warn('listen on port:' + port + ' process pid:' + worker.process.pid);
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
}
else {
    app.set('port', port);
    /**
     * Create HTTP server.
     */
    var server = http.createServer(app);
    server.listen(port);
    /**
     * Listen on provided port, on all network interfaces.
     */

    server.on('error', onError);
    server.on('listening', onListening);
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
