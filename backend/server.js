import app from './app.js';
import debug from 'debug';
import http from 'http';
import con from "./dao/mysqldao.js";

/*
    FILE DESCRIPTION: file for creating http server and running app.js
 */

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Connect to mysql database
 */

con.connect((err) => {
    if (err) console.log(err);
    con.query(
        "create table if not exists subscribers(" +
        "endpoint varchar(200) primary key, " +
        "expirationTime char(10), " +
        "p256dhkey varchar(90), " +
        "authkey varchar(25)" +
        "); " +
        "create table if not exists admins(" +
        "username varchar(15) primary key, " +
        "encryptedpw varchar(60)" +
        ");" +
        "create table if not exists pushes" +
        "(" +
        "    pushID     int auto_increment primary key," +
        "    timestamp timestamp default current_timestamp on update current_timestamp," +
        "    msgTitle   varchar(50)," +
        "    msgBody    varchar(300)," +
        "    msgOnClick varchar(1000)" +
        ");"
        ,
        (err) => {
            if (err) throw err;
        });
});

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
