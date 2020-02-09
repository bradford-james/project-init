const { parseArgsToOpts } = require('./interface/utils/functions')
const help = require('./interface/utils/help')
const version = require('./interface/utils/version')

async function cli(args) {
  const options = parseArgsToOpts(args)

  switch (options.cmd) {
    case 'help':
      help()
      break

    case 'version':
      version()
      break

    case 'template':
      try {
        // const opts = await promptQuestions(options)
        // await cli(opts)
      } catch (err) {
        // TODO log error
        console.log(err)
      }
      break

    default:
      // TODO error handling
      break
  }
}

exports.cli = cli
