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

const validateTools = () => {
  // if (
  //   tools.find(tool => {
  //     return tool.type === 'version_control_repo'
  //   })
  // )
  // promptMissingCreds()
}

exports.parseArgs = parseArgs
exports.validateInput = validateInput
exports.askCnfgDefaults = askCnfgDefaults
exports.displayCnfgDefaults = displayCnfgDefaults
exports.validateTools = validateTools
