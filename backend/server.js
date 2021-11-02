#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app.js';
import debug from 'debug';
import http from 'http';
import mongoose from 'mongoose';

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

let uri;
process.env.NODE_ENV === "production" ?
    uri = "mongodb+srv://supermancash:x.psVy33eer7T%40Y@pushnotifications.erof5.mongodb.net/subscribers_db?retryWrites=true&w=majority"
    :
    uri = "mongodb://localhost:27017/subscribers_db";

mongoose.connect(
    uri,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => console.log(err)
);

// mongo user:
//  name: supermancash
//  pw: x.psVy33eer7T@Y

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

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

    const bind = typeof port === 'string'
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
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
