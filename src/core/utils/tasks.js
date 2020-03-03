const Listr = require('listr')
const chalk = require('chalk')
const { deleteFolderRecursive } = require('./reset')
const {
  checkDirectories,
  copyFiles,
  makeDir,
  initTooling,
  setDirectoryPaths,
  addScripts,
  setRemotes,
  verifySetup,
  installDeps,
  finalSetup,
} = require('./functions')

module.exports = async (template, options) => {
  const { templateDir, stagingDir, targetDir } = setDirectoryPaths(template, options)

  await makeDir(stagingDir)
  await makeDir(targetDir)
  await checkDirectories(templateDir, stagingDir, targetDir)

  try {
    const tasks = new Listr([
      {
        title: 'Copy project files to staging',
        task: () => copyFiles(templateDir, stagingDir),
        skip: () => false,
      },
      {
        title: 'NPM init',
        task: () => initTooling.npm(stagingDir),
        skip: () => false,
      },
      // {
      //   title: 'Initialize tooling',
      //   task: () => {
      //     return new Listr(
      //       [
      {
        title: 'Set scripts and dependancies',
        task: () => addScripts(options.dirName, options.tools),
        skip: () => false,
      },
      {
        title: 'Create LICENSE file',
        task: () => initTooling.license(stagingDir),
        skip: () => false,
      },
      {
        title: 'Formatter',
        task: () => initTooling.formatter(stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'formatter'
          }),
      },
      {
        title: 'Linter',
        task: () => initTooling.linter(stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'linter'
          }),
      },
      {
        title: 'Tests',
        task: () => initTooling.tests(stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'tester'
          }),
      },
      {
        title: 'Initialize git',
        task: () => initTooling.git(options.dirName, stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'version_control'
          }),
      },
      {
        title: 'Commit Linting',
        task: () => initTooling.commit_linter(stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'commit_linter'
          }),
      },
      //       ]
      //       { concurrent: true }
      //     )
      //   },
      // },
      {
        title: 'Copy project files to main directory',
        task: () => copyFiles(stagingDir, targetDir),
        skip: () => false,
      },
      {
        title: 'Install dependancies',
        task: () => {
          installDeps(targetDir)
        },
        skip: () => false,
      },
      {
        title: 'Run linting/tests',
        task: () => verifySetup(targetDir),
        skip: () => false,
      },
      // {
      //   title: 'Set up remotes',
      //   task: () => {
      //     return new Listr([
      {
        title: 'Version Control Remote',
        task: () => setRemotes.setGit(options.dirName, targetDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'version_control_repo'
          }),
      },
      //     ])
      //   },
      // },
      {
        title: 'Teardown operations',
        task: () => {
          finalSetup.gitCommit(targetDir)
          deleteFolderRecursive(stagingDir)
        },
        skip: () => false,
      },
    ])
    await tasks.run(options)
    console.log(`\n Run ${chalk.cyan('npx semantic-release-cli setup')} to complete CI setup\n`)
    return
  } catch (err) {
    console.log(err)
  }
}
