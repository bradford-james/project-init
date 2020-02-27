const inquirer = require('inquirer')
const commander = require('commander')
const version = require('./version')

const cliHandling = (args, argsState) => {
  const program = new commander.Command()
  program.version(version)

  program
    .command('base [name]')
    .description('template: local project, default: linting/testing/formatting')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-i, --includ [csv]', 'includes: [ci]')
    .option('-m, --manual', 'pick options for each handler', false)
    .option('-c, --set-cnfg', 'change defualt packages', false)
    .option('--get-cnfg', 'change defualt packages', false)
    .action((name, options) => {
      argsState.template = 'base'

      argsState.options.dirName = name || 'prompt'
      argsState.options.dirPath = options.dir || 'cwd'

      argsState.options.displayCnfgFlag = options['get-config']

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          argsState.options.exclude.push(ex)
        })
      }
      if (options.include) {
        const inclusions = options.include.split(',')
        inclusions.forEach(inc => {
          argsState.options.include.push(inc)
        })
      }
    })

  // ToDo
  program
    .command('node-cli [name]')
    .description('template: CLI tool, default: full CI')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: 'install', 'git', 'ci'")
    .option('-l, --local', 'excludes use of public repositories')
    .option('-t, --tech <dep>', 'includes defined tools: [to be added]')
    .option('-a, --alternate <alt>', "use alternate implementation: 'lint-otherlinter")
    .action((name, cmdObj) => {
      console.log(`name: ${name}, dir: ${cmdObj.dirPath}`)
    })

  program
    .command('node-package [name]')
    .description('template: node package, default: full CI/public repo')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .action((name, options) => {
      argsState.template = 'node-package'

      argsState.options.dirName = name || 'prompt'
      argsState.options.dirPath = options.dir || 'cwd'

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          argsState.options.exclude.push(ex)
        })
      }
    })

  // ToDo
  program.command('add <feature>').description('add tech to project')

  program.parse(args)
}

const setQuestions = options => {
  const questions = []

  if (!options.template && false) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a project template:',
      choices: ['node-cli-tool', 'node-package'],
    })
  }

  if (options.dirName === 'prompt') {
    questions.push({
      type: 'input',
      name: 'dirName',
      message: 'Name of the new project:',
    })
  }

  if (!options.yes && false) {
    if (!options.installDeps) {
      questions.push({
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        default: true,
      })
    }

    if (!options.git && false) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: true,
      })
    }

    if (!options.ci && false) {
      questions.push({
        type: 'confirm',
        name: 'ci',
        message: 'Set up CI?',
        default: false,
      })
    }

    if (!options.package && false) {
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

async function promptQuestions(options) {
  let answers
  try {
    const questions = setQuestions(options)
    answers = await inquirer.prompt(questions)
  } catch (err) {
    // TODO set logging
    console.log(err)
  }
  return answers
  // TODO validation that all required fields are entered
}

exports.cliHandling = cliHandling
exports.promptQuestions = promptQuestions
