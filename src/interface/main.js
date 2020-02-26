const commander = require('commander')
const version = require('./utils/version')
// const { promptQuestions } = require('./utils/functions')

const parseArgs = args => {
  const argsState = {
    template: '',
    options: {
      cnfg: '',
      dirName: '',
      dirPath: '',
      exclude: [],
      include: [],
    },
  }

  const program = new commander.Command()
  program.version(version)

  program
    .command('base [name]')
    .description('template: local project, default: linting/testing/formatting')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-i, --includ [csv]', 'includes: [ci]')
    .option('-m, --manual', 'pick options for each handler', false)
    .option('-c, --config', 'change defualt packages')
    .action((name, options) => {
      argsState.template = 'base'

      argsState.options.dirName = name || 'prompt'
      argsState.options.dirPath = options.dir || 'cwd'

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          argsState.options.exclude.push(ex)
        })
      }
      if (options.include) {
        const inclusions = options.include.split(',')
        inclusions.forEach(inc => {
          argsState.options.include.push(inc)
        })
      }
    })

  // ToDo
  program
    .command('node-cli [name]')
    .description('template: CLI tool, default: full CI')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: 'install', 'git', 'ci'")
    .option('-l, --local', 'excludes use of public repositories')
    .option('-t, --tech <dep>', 'includes defined tools: [to be added]')
    .option('-a, --alternate <alt>', "use alternate implementation: 'lint-otherlinter")
    .action((name, cmdObj) => {
      console.log(`name: ${name}, dir: ${cmdObj.dirPath}`)
    })

  program
    .command('node-package <name>')
    .description('template: node package, default: full CI/public repo')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .action((name, options) => {
      argsState.template = 'node-package'

      argsState.options.dirName = name || 'prompt'
      argsState.options.dirPath = options.dir || 'cwd'

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          argsState.options.exclude.push(ex)
        })
      }
    })

  // ToDo
  program.command('add <feature>').description('add tech to project')

  program.parse(args)

  if (!argsState.template) {
    program.help()
    throw new Error('no valid cmd specified')
  }

  return argsState
}

// ToDo
const validateInput = input => {
  return input
}

// ToDo
// const askCnfgDefaults = template => {
//   const defaults = {}
//   return defaults
// }

exports.parseArgs = parseArgs
exports.validateInput = validateInput
// exports.askCnfgDefaults = askCnfgDefaults
