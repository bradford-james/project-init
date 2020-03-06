const path = require('path')
const chalk = require('chalk')
const {
  initCliProgramDefinition,
  promptMissingInput,
  promptDefaults,
} = require('./utils/functions')

const displayCnfgDefaults = defaultOpts => {
  console.log('')
  defaultOpts.forEach(opt => {
    console.log(`    tool: ${chalk.green(opt.type)} => default: ${chalk.green(opt.default)}`)
  })
  console.log('')
}

const askCnfgDefaults = async (cnfgOptions, currDefaults) => {
  const defaultPrompts = []

  currDefaults.forEach(currDefault => {
    const current = currDefault.default
    const options = cnfgOptions[currDefault.type]

    const promptOpt = options.map(opt => (current === opt ? `${opt} (current)` : opt))
    defaultPrompts.push({ [currDefault.type]: promptOpt })
  })

  const setDefaults = await promptDefaults(defaultPrompts)
  return setDefaults
}

const parseArgs = args => {
  const argsReceiver = {
    template: '',
    options: {
      dirName: '',
      dirPath: '',
      exclude: [],
      include: [],
      displayCnfgFlag: false,
      setCnfgFlag: false,
      manualFlag: false,
    },
  }

  const program = initCliProgramDefinition(argsReceiver)
  program.parse(args)

  if (!argsReceiver.template) {
    program.help()
    throw new Error('no valid cmd specified')
  }

  return argsReceiver
}

const validateInput = async input => {
  const returnedAnswers = await promptMissingInput(input)

  if (returnedAnswers) {
    const answers = Object.entries(returnedAnswers)
    answers.forEach(answer => {
      const [property, value] = answer
      input[property] = value
    })
  }

  return input
}

const validateTools = async tools => {
  if (
    tools.find(tool => {
      return tool.type === 'ci'
    }) &&
    (!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD)
  ) {
    console.log(`
    If you want to setup a remote version control repository, set your credentials in a ${chalk.yellow(
      '.env'
    )} file at the root of your directory
      root directory: 
    => ${chalk.cyan(`cd ${path.join(__dirname, '../../')}`)}
    
    To setup GitHub access, write in .env file (replace ${chalk.cyan('username')} & ${chalk.cyan(
      'password'
    )} with your credentials):
    ${chalk.cyan(`  GITHUB_USER=username
      GITHUB_PASSWORD=password`)}
    
    Otherwise use the 'node-base' template to set up a local project
    => ${chalk.cyan('proj-init node-base <project_name>')}
    `)
    process.exit(0)
  }
  return true
}

exports.parseArgs = parseArgs
exports.validateInput = validateInput
exports.askCnfgDefaults = askCnfgDefaults
exports.displayCnfgDefaults = displayCnfgDefaults
exports.validateTools = validateTools
