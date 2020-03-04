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
        task: () => initTooling.npm(stagingDir),
        skip: () => false,
      },
    ]),
  }
  const tgToolingSetup = {
    title: 'Tooling Setup',
    tasks: new Listr(
      [
        {
          title: 'set scripts and dependancies',
          task: () => addScripts(options.dirName, options.tools),
          skip: () => false,
        },
        {
          title: 'create license file',
          task: () => initTooling.license(stagingDir),
          skip: () => false,
        },
        {
          title: 'formatter',
          task: () => initTooling.formatter(stagingDir),
          skip: () =>
            !options.tools.find(element => {
              return element.type === 'formatter'
            }),
        },
        {
          title: 'linter',
          task: () => initTooling.linter(stagingDir),
          skip: () =>
            !options.tools.find(element => {
              return element.type === 'linter'
            }),
        },
        {
          title: 'tester',
          task: () => initTooling.tests(stagingDir),
          skip: () =>
            !options.tools.find(element => {
              return element.type === 'tester'
            }),
        },
        {
          title: 'version control',
          task: () => initTooling.git(options.dirName, stagingDir),
          skip: () =>
            !options.tools.find(element => {
              return element.type === 'version_control'
            }),
        },
        {
          title: 'commit linting',
          task: () => initTooling.commit_linter(stagingDir),
          skip: () =>
            !options.tools.find(element => {
              return element.type === 'commit_linter'
            }),
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
        task: () => setRemotes.setGit(options.dirName, targetDir),
        skip: () =>
          !options.tools.find(tool => {
            return tool.type === 'version_control_repo'
          }),
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
        skip: () => false,
      },
    ]),
  }
  const tgFinal = {
    title: 'Validation & Teardown',
    tasks: new Listr([
      {
        title: 'run linting/tests',
        task: () => finalSetup.verifySetup(targetDir),
        skip: () => true,
      },
      {
        title: 'teardown operations',
        task: async () => {
          await deleteFolderRecursive(stagingDir)
          await finalSetup.gitCommit(targetDir)
        },
        skip: () => false,
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
    await runTaskGroup(tgFinal) // runs tests, deletes staging, git commit
    if (!options.tools.ci)
      console.log(
        `\n=> Run ${chalk.cyan(
          `cd ${options.dirName} && npx semantic-release-cli setup`
        )} to complete CI setup\n=> Set API keys returned from setup in CI Env. Variables\n`
      )
    return
  } catch (err) {
    console.log(err)
  }
}
