const { cliHandling, promptQuestions } = require('./utils/functions')

const parseArgs = args => {
  const argsState = {
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

  // populates argsState w/ args from cli
  cliHandling(args, argsState)

  if (!argsState.template) {
    program.help()
    throw new Error('no valid cmd specified')
  }

  return argsState
}

// ToDo
const validateInput = async input => {
  const answers = await promptQuestions(input)
  if (!answers) input.dirName = answers.dirName
  return input
}

// ToDo
// const askCnfgDefaults = template => {
//   const defaults = {}
//   return defaults
// }

exports.parseArgs = parseArgs
exports.validateInput = validateInput
// exports.askCnfgDefaults = askCnfgDefaults
