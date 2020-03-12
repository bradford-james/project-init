const Listr = require('listr')
const chalk = require('chalk')
const { deleteFolderRecursive } = require('../utils/reset')
const {
  checkDirectories,
  copyFiles,
  makeDir,
  initTooling,
  setDirectoryPaths,
  setRemotes,
  installDeps,
  finalSetup,
} = require('./functions')

module.exports = async (template, options) => {
  const { templateDir, stagingDir, targetDir } = setDirectoryPaths(template, options)

  // tg, aka 'task groups'
  const tgDirectorySetup = {
    title: 'Directory Setup',
    tasks: new Listr([
      {
        title: 'make staging directory',
        task: () => makeDir(stagingDir),
        skip: () => false,
      },
      {
        title: 'make target directory',
        task: () => makeDir(targetDir),
        skip: () => false,
      },
      {
        title: 'verify directory setup',
        task: () => checkDirectories(templateDir, stagingDir, targetDir),
        skip: () => false,
      },
      {
        title: 'copy project files to staging',
        task: () => copyFiles(templateDir, stagingDir),
        skip: () => false,
      },
    ]),
  }
  const tgNpmSetup = {
    title: 'NPM Setup',
    tasks: new Listr([
      {
        title: 'npm init -y',
        task: () => initTooling.npm(options.dirName, stagingDir),
        skip: () => false,
      },
    ]),
  }
  const tgToolingSetup = {
    title: 'Tooling Setup',
    tasks: new Listr(
      [
        {
          title: 'common utilities',
          task: () => initTooling.common(stagingDir),
        },
        {
          title: 'formatter',
          task: () => initTooling.formatter(template),
          skip: () => !options.tools.formatter,
        },
        {
          title: 'linter',
          task: () => initTooling.linter(template),
          skip: () => !options.tools.linter,
        },
        {
          title: 'logger',
          task: () => initTooling.logger(template),
          skip: () => !options.tools.logger,
        },
        {
          title: 'tester',
          task: () => initTooling.tests(stagingDir),
          skip: () => !options.tools.tester,
        },
        {
          title: 'version control',
          task: () => initTooling.version_control(options.dirName, stagingDir),
          skip: () => !options.tools.version_control,
        },
        {
          title: 'commit linting',
          task: () => initTooling.commit_linter(stagingDir),
          skip: () => !options.tools.commit_linter,
        },
        {
          title: 'version control repo',
          task: () => initTooling.version_control_repo(options.dirName, stagingDir),
          skip: () => !options.tools.version_control_repo,
        },
        {
          title: 'ci',
          task: () => initTooling.ci(stagingDir),
          skip: () => !options.tools.ci,
        },
      ],
      { concurrent: true }
    ),
  }
  const tgImportToDir = {
    title: 'Copy To Target',
    tasks: new Listr([
      {
        title: 'copy project files to main directory',
        task: () => copyFiles(stagingDir, targetDir),
        skip: () => false,
      },
    ]),
  }
  const tgRemoteSetup = {
    title: 'Remote Endpoint Setup',
    tasks: new Listr([
      {
        title: 'version control remote',
        task: () => setRemotes.git(options.dirName, targetDir),
        skip: () => !options.tools.version_control_repo,
      },
    ]),
  }
  const tgInstallDeps = {
    title: 'Install Dependancies',
    message: '**this may take a few minutes**',
    tasks: new Listr([
      {
        title: 'install dependancies',
        task: async () => {
          await installDeps(targetDir)
        },
        skip: () => options.noInstall,
      },
    ]),
  }
  const tgFinal = {
    title: 'Validation & Teardown',
    tasks: new Listr([
      {
        title: 'delete staging directory',
        task: () => deleteFolderRecursive(stagingDir),
      },
      {
        title: 'clean up docs',
        task: () => finalSetup.cleanInitMD(targetDir),
      },
      {
        title: 'git commit',
        task: () => finalSetup.gitCommit(targetDir),
        skip: () => !options.tools.version_control,
      },
    ]),
  }

  const runTaskGroup = async taskGroup => {
    console.log(chalk.blue(`\n${taskGroup.title}`))
    if (taskGroup.message) console.log(chalk.yellow(taskGroup.message))
    await taskGroup.tasks.run(options)
  }

  try {
    await runTaskGroup(tgDirectorySetup)
    await runTaskGroup(tgNpmSetup)
    await runTaskGroup(tgToolingSetup)
    await runTaskGroup(tgImportToDir)
    await runTaskGroup(tgRemoteSetup)
    await runTaskGroup(tgInstallDeps)
    await runTaskGroup(tgFinal) // deletes staging, git commit
    return
  } catch (err) {
    console.log(err)
  }
}
