const commander = require('commander')
const projInit = require('../project-init/main')
const version = require('./version')

const program = new commander.Command()
program.version(version)
// help is auto-generated

program
  .command('base <name>')
  .description('template: local project, default: linting/testing/formatting')
  // defaults directory to cwd
  .option('-d, --dir <dirPath>', 'target directory path', 'cwd')
  // augment template with:
  .option('-x, --exlude [ex]', "don't include: [install,git]")
  .option('-i, --includ [inc]', 'includes: [ci]')
  .option('-t, --tech [dep]', 'includes defined tools: [to be added]')
  // select all options manually
  .option('-m, --manual', 'pick options for each handler', false)
  .option('-c, --config', 'change defualt packages')
  .action((name, opts) => run(name, opts))

const run = async (name, opts) => {
  const setOpts = await verifyOpts(opts)

  const instructions = {
    template: 'base',
    dirName: name,
    targetDir: opts.dir,
    opts: {
      ...setOpts,
    },
  }

  projInit(instructions)
}

// async (template, opts) => {
// const executable = await setOpts(opts)
// executable.template = template

// program
//   .command('node-cli <name>')
//   .description('template: CLI tool, default: full CI')
//   .option('-d, --dir <dirPath>', 'target directory path')
//   .option('-x, --exclude <opts>', "don't include: 'install', 'git', 'ci'")
//   .option('-l, --local', 'excludes use of public repositories')
//   .option('-t, --tech <dep>', 'includes defined tools: [to be added]')
//   .option('-a, --alternate <alt>', "use alternate implementation: 'lint-otherlinter")
//   .action((name, cmdObj) => {
//     console.log(`name: ${name}, dir: ${cmdObj.dirPath}`)
//   })

// program
//   .command('node-package <name>')
//   .describe('template: node package, default: full CI/public repo')

// program.command('add <tech>').describe('add tech to project')

const verifyOpts = async inputOpts => {
  let verifiedOpts

  if (inputOpts.manual === true) {
    verifiedOpts = await promptQuestions(inputOpts)
  } else {
    verifiedOpts = getDefaults(inputOpts)
  }

  return verifiedOpts
}

const getDefaults = opts => {
  return {
    formatting: 'prettier',
    linting: 'eslint',
    testing: 'jest',
  }
}

const setQuestions = options => {
  const questions = []
  //ask formatter
  if (!options.formatting) {
    questions.push({
      type: 'list',
      name: 'formatting',
      message: 'Choose a formatter:',
      choices: ['prettier', 'other'],
    })
  }
  //ask linter
  //ask tester
  return questions
}

async function promptQuestions(opts) {
  let answers
  try {
    const questions = setQuestions(opts)
    answers = await inquirer.prompt(questions)
  } catch (err) {
    // TODO set logging
    console.log(`ERROR: ${err}`)
  }
  return answers
  // TODO validation that all required fields are entered?
}

exports.cli = program.parse(process.argv)
