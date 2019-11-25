'use strict'
exports.default = start
var _http = require('http')
var _next = require('next')
var _next_config = require('next/config')
var Primus = require('primus')
var PrimusRedisRooms = require('primus-redis-rooms')

async function start(serverOptions, port, hostname) {
    const app = (0, _next)(serverOptions)
    const srv = _http.createServer(app.getRequestHandler())
    const next_cfg = _next_config.default()
    const {
        serverRuntimeConfig: { PRIMUS_1_HOST, PRIMUS_1_PORT },
    } = next_cfg
    const primus = new Primus(srv, {
        transformer: 'websockets',
        // redis: {
        //   host: PRIMUS_1_HOST,
        //   port: parseInt(PRIMUS_1_PORT)
        // }
    })
    // primus.use('redis', PrimusRedisRooms)

    // primus.on('connection', function connection(spark) {
    //     spark.on('data', function received(data) {
    //       data = data || {};
    //       var action = data.action;
    //       var room = data.room;

    //       // join a room
    //       if ('join' === action) {
    //         spark.join(room, function () {

    //           // send message to this client
    //           spark.write('you joined room ' + room);

    //           // send message to all clients except this one
    //           spark.room(room).except(spark.id).write(spark.id + ' joined room ' + room);
    //         });
    //       }

    //       // leave a room
    //       if ('leave' === action) {
    //         spark.leave(room, function () {

    //           // send message to this client
    //           spark.write('you left room ' + room);
    //         });
    //       }
    //     });
    //   });
    await new Promise((resolve, reject) => {
        // This code catches EADDRINUSE error if the port is already in use
        srv.on('error', reject)
        srv.on('listening', () => resolve())
        srv.listen(port, hostname)
    }) // It's up to caller to run `app.prepare()`, so it can notify that the server
    // is listening before starting any intensive operations.
    return app
}
