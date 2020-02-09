const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const tasks = require('./utils/tasks')

const access = promisify(fs.access)

// TODO seperate out console.logs to interface

module.exports = async options => {
  // Set target and template directories
  // eslint-disable-next-line no-param-reassign
  if (!options.targetDirectory) options.targetDirectory = process.cwd()

  const templateDir = path.resolve(
    __dirname,
    '../templates',
    options.template.toLowerCase()
  )
  // eslint-disable-next-line no-param-reassign
  options.templateDirectory = templateDir

  // Check access privledges
  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    // TODO logging, error handling
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  // Run Tasks
  tasks()
  // TODO this belongs in the interface module, w/ the chalk dep.
  console.log('%s Project ready', chalk.green.bold('DONE'))
  return true
}
