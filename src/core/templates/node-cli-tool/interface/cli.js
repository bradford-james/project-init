const minimist = require('minimist')
// const { projectMain } = require('./main')
const help = require('./utils/help')
const version = require('./utils/version')
// const error = require('./utils/error')

const parseArgs = rawArgs => {
  const args = minimist(rawArgs.slice(2), {
    boolean: ['help', 'version'],
    alias: { h: 'help', v: 'version' },
  })
  return args
}

export default rawArgs => {
  const args = parseArgs(rawArgs)

  let cmd = args._[0] // default command || "";

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    // case 'app':
    // projectMain()
    // break
    case 'version':
      version()
      break
    case 'help':
      help()
      break
    default:
    // error(`${cmd} is not a valid command`, true)
  }
}
