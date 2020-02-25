const execa = require('execa')
const path = require('path')
// const { projectInstall } = require('pkg-install')
const ncp = require('ncp')
const { promisify } = require('util')
const fs = require('fs')
const chalk = require('chalk')

const access = promisify(fs.access)
const copy = promisify(ncp)

const setDirectories = (template, options) => {
  const templateDir = path.join(__dirname, '../templates', template)
  const stagingDir = path.join(__dirname, '../staging')
  // if (process.env.NODE_ENV === 'dev') options.dirPath = 'cwd'
  const targetDir =
    options.dirPath === 'cwd' || options.dirPath === ''
      ? path.join(process.cwd(), options.dirName)
      : path.resolve(process.cwd(), options.dirPath, options.dirName)

  return { templateDir, stagingDir, targetDir }
}

const checkDirectories = async (templateDir, stagingDir, targetDirectory) => {
  let testDir
  try {
    testDir = 'templateDir'
    await access(templateDir, fs.constants.R_OK)

    testDir = 'stagingDir'
    await access(stagingDir, fs.constants.R_OK)

    testDir = 'targetDirectory'
    await access(targetDirectory, fs.constants.R_OK)
    testDir = ''
  } catch (err) {
    console.error(`${chalk.red.bold('ERROR')} ${err} (${testDir})`)
    process.exit(1)
  }
}

const copyFiles = async (templateDir, targetDirectory) => {
  await copy(templateDir, targetDirectory, {
    clobber: false,
  }).catch(err => {
    console.log(err)
    throw new Error('problem with copying template directory')
  })

  return true
}

const makeMainDir = async dirName => {
  await fs.mkdir(dirName, { recursive: true }, err => {
    console.log(err)
  })
  return true
}

const initGit = async dirPath => {
  const result = await execa('git', ['init'], {
    cwd: dirPath,
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return true
}

const teardown = () => {}

exports.setDirectories = setDirectories
exports.checkDirectories = checkDirectories
exports.copyFiles = copyFiles
exports.makeMainDir = makeMainDir
exports.teardown = teardown
exports.initGit = initGit
