// -----------------
// |    IMPORTS    |
// -----------------

require('dotenv').config()
const commander = require('commander')
const version = require('./src/interface/utils/version')
const { askCnfgDefaults, validateInput, display } = require('./src/interface/main')
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
        const currentDefaults = await getCnfgDefaults(template)
        display.cnfgDefaults(currentDefaults)
      } else if (options.setCnfg === true) {
        const currentDefaults = await getCnfgDefaults(template)
        const cnfgOptions = await getCnfgOptions(template)
        const newDefaults = await askCnfgDefaults(cnfgOptions, currentDefaults)
        setCnfgDefaults(template, newDefaults)
      } else {
        let initInstructions = {
          dirName: name,
          dirPath: options.dir,
          tools: await setTooling(template),
        }
        initInstructions = await validateInput(initInstructions)
        await projInit(template, initInstructions)
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
        const currentDefaults = await getCnfgDefaults(template)
        display.cnfgDefaults(currentDefaults)
      } else if (options.setCnfg === true) {
        const currentDefaults = await getCnfgDefaults(template)
        const cnfgOptions = await getCnfgOptions(template)
        const newDefaults = await askCnfgDefaults(cnfgOptions, currentDefaults)
        setCnfgDefaults(template, newDefaults)
      } else {
        let initInstructions = {
          dirName: name,
          dirPath: options.dir,
          tools: await setTooling(template),
        }
        initInstructions = await validateInput(initInstructions)
        await projInit(template, initInstructions)
      }
    })

  // ToDo
  // program.command('add <feature>').description('add tech to project')

  await program.parse(args)

  // program.help()
}

exports.cli = cli
