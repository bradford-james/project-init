const minimist = require('minimist')
const inquirer = require('inquirer')

// TODO add proto option (just eslint, npm init, and formatting)
// TODO add options to add features later
// TODO add option to specify different services from default (other linters, CI)

const parseArgsToOpts = rawArgs => {
  const args = minimist(rawArgs.slice(2), {
    string: ['name', 'dir'],
    boolean: ['yes', 'installDeps', 'git', 'ci', 'package', 'help', 'version'],
    alias: {
      n: 'name',
      d: 'dir',
      y: 'yes',
      i: 'installDeps',
      g: 'git',
      c: 'ci',
      p: 'package',
      h: 'help',
      v: 'version',
    },
    default: { yes: false },
  })

  // eslint-disable-next-line eqeqeq
  if (args._[0] === 'help' || args.help || args._[0] == '') return { cmd: 'help' }
  if (args._[0] === 'version' || args.version) return { cmd: 'version' }

  return {
    cmd: 'template',
    template: args._[0],
    dirName: args.name,
    targetDir: args.dir,
    useDefaults: args.yes,
    installDeps: args.installDeps,
    git: args.git,
    ci: args.ci,
    package: args.package,
  }
}

const setQuestions = options => {
  const questions = []

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a project template:',
      choices: ['node-cli-tool', 'node-package'],
    })
  }

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'dirName',
      message: 'Name of the new project:',
    })
  }

  if (!options.yes) {
    if (!options.installDeps) {
      questions.push({
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        default: true,
      })
    }

    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: true,
      })
    }

    if (!options.ci) {
      questions.push({
        type: 'confirm',
        name: 'ci',
        message: 'Set up CI?',
        default: false,
      })
    }

    if (!options.package) {
      questions.push({
        type: 'confirm',
        name: 'package',
        message: 'Is this a package?',
        default: false,
      })
    }
  }

  return questions
}

const setOptsWithAnswers = (options, answers) => {
  return {
    cmd: options.cmd,
    template: options.template || answers.template,
    dirName: options.name || answers.dirName,
    // directory name will default to CWD if not entered here
    targetDir: options.targetDir,
    useDefaults: options.useDefaults,
    installDeps: options.installDeps || answers.installDeps,
    git: options.git || answers.git,
    ci: options.ci || answers.ci,
    package: options.package || answers.package,
  }
}

async function promptQuestions(options) {
  let answers
  try {
    const questions = setQuestions(options)
    answers = await inquirer.prompt(questions)
  } catch (err) {
    // TODO set logging
    console.log(err)
  }
  return setOptsWithAnswers(options, answers)
  // TODO validation that all required fields are entered
}

exports.parseArgsToOpts = parseArgsToOpts
exports.promptQuestions = promptQuestions
