const Listr = require('listr')
const execa = require('execa')
const { projectInstall } = require('pkg-install')
const ncp = require('ncp')
const { promisify } = require('util')

const makeMainDir = async options => {
  const result = await execa('mkdir', [options.newDirName])
  if (result.failed) {
    return Promise.reject(new Error('Failed to create directory'))
  }
  return true
}

const copyTemplateFiles = async options => {
  const copy = promisify(ncp)
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  })
}

const initGit = async options => {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory,
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
  return true
}

module.exports = async options => {
  try {
    console.log(options)
    const tasks = new Listr([
      {
        title: 'Make Main Directory',
        task: () => makeMainDir(options),
      },
      {
        title: 'Copy project files',
        task: () => copyTemplateFiles(options),
      },
      {
        title: 'Initialize git',
        task: () => initGit(options),
        enabled: () => options.git,
      },
      {
        title: 'Install dependancies',
        task: () =>
          projectInstall({
            cwd: options.targetDirectory,
          }),
        skip: () =>
          !options.runInstall
            ? 'Pass --install to automatically install dependancies'
            : undefined,
      },
    ])
    await tasks.run(options)
    return
  } catch (err) {
    console.log(err)
  }
}
