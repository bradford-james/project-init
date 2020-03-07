// -----------------
// |    IMPORTS    |
// -----------------

require('dotenv').config()
const commander = require('commander')
const { askCnfgDefaults, validateInput, display, version } = require('./src/interface/main')
const {
  getCnfgDefaults,
  getCnfgOptions,
  setCnfgDefaults,
  setTooling,
  projInit,
} = require('./src/core/main')

// -----------------
// |    PROGRAM    |
// -----------------

const getCnfg = async template => {
  const currentDefaults = await getCnfgDefaults(template)
  display.cnfgDefaults(currentDefaults)
}

const setCnfg = async template => {
  const currentDefaults = await getCnfgDefaults(template)
  const cnfgOptions = await getCnfgOptions(template)
  const newDefaults = await askCnfgDefaults(cnfgOptions, currentDefaults)
  setCnfgDefaults(template, newDefaults)
}

const runInit = async (template, name, options) => {
  let initInstructions = {
    dirName: name,
    dirPath: options.dir,
    tools: await setTooling(template),
  }
  initInstructions = await validateInput(initInstructions)
  await projInit(template, initInstructions)
}

const cli = async args => {
  const program = new commander.Command()

  program.version(version)
  program.on('--help', display.mainHelp)

  program
    .command('node-base [name]')
    .description('template: local project, default: linting/testing/formatting')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-i, --includ [csv]', 'includes: [ci]')
    .option('-m, --manual', 'pick options for each handler', false)
    .option('-s, --set-cnfg', 'change defualt packages', false)
    .option('-c, --get-cnfg', 'change defualt packages', false)
    .action(async (name, options) => {
      const template = 'node-base'

      if (options.getCnfg === true) {
        await getCnfg(template)
      } else if (options.setCnfg === true) {
        await setCnfg(template)
      } else {
        await runInit(template, name, options)
      }
    })

  program
    .command('node-package [name]')
    .description('template: node package, default: full CI/public repo')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-s, --set-cnfg', 'change defualt packages', false)
    .option('-c, --get-cnfg', 'change defualt packages', false)
    .action(async (name, options) => {
      const template = 'node-package'

      if (options.getCnfg === true) {
        await getCnfg(template)
      } else if (options.setCnfg === true) {
        await setCnfg(template)
      } else {
        await runInit(template, name, options)
      }
    })

  // ToDo
  // program.command('add <feature>').description('add tech to project')

  await program.parse(args)

  // program.help()
}

exports.cli = cli
