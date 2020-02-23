const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const initTasks = require('./utils/tasks')

const access = promisify(fs.access)

// TODO seperate out console.logs to interface

module.exports = instr => {
  console.log(instr)
}

const main = async options => {
  const projectDef = options

  // Set target and template directories
  if (!projectDef.targetDirectory) projectDef.targetDirectory = process.cwd()

  const templateDir = path.resolve(__dirname, 'templates', projectDef.template.toLowerCase())
  projectDef.templateDirectory = templateDir

  // Check access privledges
  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    // TODO logging, error handling
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  // Run Tasks
  initTasks()

  // TODO this belongs in the interface module, w/ the chalk dep.
  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
