import * as log from 'loglevel';

if (process.env.NODE_ENV === "development") {
    log.setDefaultLevel(log.levels.DEBUG)
}

export default log;