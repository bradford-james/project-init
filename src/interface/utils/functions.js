const inquirer = require('inquirer')
const commander = require('commander')
const version = require('./version')

const promptDefaults = async prompts => {
  const questions = []
  prompts.forEach(prompt => {
    const key = Object.keys(prompt)[0]
    questions.push({
      type: 'list',
      name: `${key}`,
      message: `Choose ${key}:`,
      choices: prompt[key],
    })
  })
  const answers = await inquirer.prompt(questions)
  return answers
}

const initCliProgramDefinition = argsReceiver => {
  const aR = argsReceiver

  const program = new commander.Command()
  program.version(version)

  program.on('--help', function() {
    console.log('')
  })

  program
    .command('base [name]')
    .description('template: local project, default: linting/testing/formatting')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-i, --includ [csv]', 'includes: [ci]')
    .option('-m, --manual', 'pick options for each handler', false)
    .option('-s, --set-cnfg', 'change defualt packages', false)
    .option('-c, --get-cnfg', 'change defualt packages', false)
    .action((name, options) => {
      aR.template = 'base'

      aR.options.dirName = name || 'prompt'
      aR.options.dirPath = options.dir || 'cwd'

      aR.options.displayCnfgFlag = options.getCnfg
      aR.options.setCnfgFlag = options.setCnfg

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          aR.options.exclude.push(ex)
        })
      }
      if (options.include) {
        const inclusions = options.include.split(',')
        inclusions.forEach(inc => {
          aR.options.include.push(inc)
        })
      }
    })

  // ToDo
  // program
  //   .command('node-cli [name]')
  //   .description('template: CLI tool, default: full CI')
  //   .option('-d, --dir [dirPath]', 'target directory path')
  //   .option('-x, --exclude [csv]', "don't include: 'install', 'git', 'ci'")
  //   .option('-l, --local', 'excludes use of public repositories')
  //   .option('-t, --tech <dep>', 'includes defined tools: [to be added]')
  //   .option('-a, --alternate <alt>', "use alternate implementation: 'lint-otherlinter")
  //   .action((name, cmdObj) => {
  //     console.log(`name: ${name}, dir: ${cmdObj.dirPath}`)
  //   })

  program
    .command('node-package [name]')
    .description('template: node package, default: full CI/public repo')
    .option('-d, --dir [dirPath]', 'target directory path')
    .option('-x, --exclude [csv]', "don't include: [install,git]")
    .option('-s, --set-cnfg', 'change defualt packages', false)
    .option('-c, --get-cnfg', 'change defualt packages', false)
    .action((name, options) => {
      aR.template = 'node-package'

      aR.options.dirName = name || 'prompt'
      aR.options.dirPath = options.dir || 'cwd'

      aR.options.displayCnfgFlag = options.getCnfg
      aR.options.setCnfgFlag = options.setCnfg

      if (options.exclude) {
        const exclusions = options.exclude.split(',')
        exclusions.forEach(ex => {
          aR.options.exclude.push(ex)
        })
      }
    })

  // ToDo
  // program.command('add <feature>').description('add tech to project')

  return program
}

const setQuestions = options => {
  const questions = []

  if (options.dirName === 'prompt') {
    questions.push({
      type: 'input',
      name: 'dirName',
      message: 'Name of the new project:',
    })
  }

  return questions
}

const promptMissingInput = async options => {
  let answers
  try {
    const questions = setQuestions(options)
    answers = await inquirer.prompt(questions)
  } catch (err) {
    console.log(err)
  }
  return answers
}

exports.initCliProgramDefinition = initCliProgramDefinition
exports.promptMissingInput = promptMissingInput
exports.promptDefaults = promptDefaults
