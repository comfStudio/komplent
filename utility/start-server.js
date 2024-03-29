'use strict'
exports.__esModule = true
exports.default = void 0
var _http = _interopRequireDefault(require('http'))
var _next = _interopRequireDefault(require('../next'))
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
}
let start
try {
    start = require(process.cwd() + '/server/start').default
} catch (e) {
    console.log(e)
    start = async (serverOptions, port, hostname) => {
        const app = (0, _next.default)(serverOptions)
        const srv = _http.default.createServer(app.getRequestHandler())
        await new Promise((resolve, reject) => {
            // This code catches EADDRINUSE error if the port is already in use
            srv.on('error', reject)
            srv.on('listening', () => resolve())
            srv.listen(port, hostname)
        }) // It's up to caller to run `app.prepare()`, so it can notify that the server
        // is listening before starting any intensive operations.
        return app
    }
}
var _default = start
exports.default = _default
