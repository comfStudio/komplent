"use strict";
exports.default = start
var _http = require("http")
var _next = require("next")
var _next_config = require("next/config")
var Primus = require('primus')


async function start(serverOptions, port, hostname) {
    const app = (0, _next)(serverOptions);
    const srv = _http.createServer(app.getRequestHandler());
    const primus = new Primus(srv, {
        transformer: 'websockets',
        redis: {
            sentinel: true,
            endpoints: [
                { host: 'localhost', port: 26379 },
                { host: 'localhost', port: 26380 },
                { host: 'localhost', port: 26381 }
              ],
            masterName: 'mymaster',
            channel: 'primus'
        }
    })
    const next_cfg = _next_config.default()
    console.log(next_cfg)
    primus.on('connection', function connection(spark) {
        spark.on('data', function received(data) {
          console.log(spark.id, 'received message:', data);
          spark.write(data);
        });
      });
    await new Promise((resolve, reject) => { // This code catches EADDRINUSE error if the port is already in use
        srv.on('error', reject);
        srv.on('listening', () => resolve());
        srv.listen(port, hostname);
    }); // It's up to caller to run `app.prepare()`, so it can notify that the server
    // is listening before starting any intensive operations.
    return app;
}