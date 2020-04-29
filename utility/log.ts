import * as log from 'loglevel'
import chalk from 'chalk'
import prefix from 'loglevel-plugin-prefix'

const colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red,
  };
  
prefix.reg(log);
prefix.apply(log, {
format(level, name, timestamp) {
return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`;
},
});

prefix.apply(log.getLogger('critical'), {
format(level, name, timestamp) {
return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
},
});

global.log = log

if (['development', 'test'].includes(process.env.NODE_ENV)) {
    log.setDefaultLevel(log.levels.DEBUG)
}

export default log
