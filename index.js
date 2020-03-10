// -----------------
// |    IMPORTS    |
// -----------------

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const commander = require('commander')
const { promptCnfgDefaults, validateInput, display, version } = require('./interface')
const { getCnfgDefaults, getCnfgOptions, setCnfgDefaults, projInit } = require('./proj_init')

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
  const newDefaults = await promptCnfgDefaults(cnfgOptions, currentDefaults)
  setCnfgDefaults(template, newDefaults)
}

const runInit = async (template, name, options) => {
  let initInstructions = {
    dirName: name,
    dirPath: options.dir,
    noInstall: options.notInstall,
    tools: await getCnfgDefaults(template),
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
    .option('-n, --not-install', "don't install dependancies", false)
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
    .option('-n, --not-install', "don't install dependancies", false)
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

  await program.parse(args)

  // program.help()
}

exports.cli = cli
