require('dotenv').config()
const {
  parseArgs,
  displayCnfgDefaults,
  askCnfgDefaults,
  validateInput,
} = require('./src/interface/main')
const {
  getCnfgDefaults,
  getCnfgOptions,
  setCnfgDefaults,
  addFeature,
  setTooling,
  projInit,
} = require('./src/core/main')

const cli = async args => {
  const { template, options } = parseArgs(args)

  if (options.displayCnfgFlag === true) {
    const currentDefaults = await getCnfgDefaults(template)
    displayCnfgDefaults(currentDefaults)
    process.exit(0)
  }

  if (options.setCnfgFlag === true) {
    const currentDefaults = await getCnfgDefaults(template)
    const cnfgOptions = await getCnfgOptions(template)
    const newDefaults = await askCnfgDefaults(cnfgOptions, currentDefaults)
    setCnfgDefaults(template, newDefaults)
    process.exit(0)
  }

  if (template === 'add') {
    const validatedOpts = validateInput(options)
    addFeature(validatedOpts)
    process.exit(0)
  } else {
    const { dirName, dirPath } = await validateInput(options)

    const initInstructions = { dirName, dirPath }
    initInstructions.tools = await setTooling(template)

    // await validateTools(initInstructions.tools)

    await projInit(template, initInstructions)
    process.exit(0)
  }
}

exports.cli = cli
