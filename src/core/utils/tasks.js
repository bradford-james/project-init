const Listr = require('listr')
const { deleteFolderRecursive } = require('./reset')
const {
  checkDirectories,
  copyFiles,
  initGit,
  makeMainDir,
  initTooling,
  setDirectories,
  addScripts,
  setRemotes,
  verifySetup,
  installDeps,
} = require('./functions')

module.exports = async (template, options) => {
  const { templateDir, stagingDir, targetDir } = setDirectories(template, options)

  await makeMainDir(stagingDir)
  await makeMainDir(targetDir)
  await checkDirectories(templateDir, stagingDir, targetDir)

  try {
    const tasks = new Listr([
      // {
      //   title: 'Setup Directories',
      //   task: () => {
      //     return new Listr([
      // {
      //   title: 'Make Staging',
      //   task: () => makeMainDir(stagingDir),
      // },
      // {
      //   title: 'Make Main',
      //   task: () => makeMainDir(targetDir),
      // },
      //       {
      //         title: 'Validate Directories',
      //         task: () => checkDirectories(templateDir, stagingDir, targetDir),
      //       },
      //     ])
      //   },
      // },
      {
        title: 'Copy project files to staging',
        task: () => copyFiles(templateDir, stagingDir),
      },
      {
        title: 'NPM init',
        task: () => initTooling.npm(stagingDir),
      },
      {
        title: 'Initialize tooling',
        task: () => {
          return new Listr(
            [
              {
                title: 'Set scripts and dependancies',
                task: () => addScripts(options.dirName),
              },
              {
                title: 'LICENSE',
                task: () => initTooling.license(stagingDir),
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
            ],
            { concurrent: true }
          )
        },
      },
      {
        title: 'Initialize git',
        task: () => initGit(stagingDir),
        skip: () =>
          !options.tools.find(element => {
            return element.type === 'version_control'
          }),
      },
      {
        title: 'Copy project files to main directory',
        task: () => copyFiles(stagingDir, targetDir),
      },
      {
        title: 'Install dependancies',
        task: () => {
          installDeps(targetDir)
        },
        skip: () => true,
      },
      {
        title: 'Run linting/tests',
        task: () => verifySetup(targetDir),
        skip: () => true,
      },
      {
        title: 'Set up remotes',
        task: () => setRemotes(targetDir),
        skip: () => true,
      },
      {
        title: 'Teardown operations',
        task: () => deleteFolderRecursive(stagingDir),
      },
    ])
    await tasks.run(options)
    return
  } catch (err) {
    console.log(err)
  }
}
