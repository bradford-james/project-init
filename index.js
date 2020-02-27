const { parseArgs, validateInput, askCnfgDefaults } = require('./src/interface/main')
const { displayCnfgDefaults, setCnfgDefaults, addFeature, projInit } = require('./src/core/main')

const cli = async args => {
  const { template, options } = parseArgs(args)

  if (options.displayCnfgFlag === true) {
    displayCnfgDefaults(template)
  } else if (options.setCnfg === true) {
    const currentDefaults = getCnfgDefaults(template)
    const newDefaults = askCnfgDefaults(template, currentDefaults)
    setCnfgDefaults(template, newDefaults)
  } else if (template === 'add') {
    const setOptions = validateInput(options)
    addFeature(setOptions)
  } else {
    const setOptions = await validateInput(options)
    projInit(template, setOptions)
  }
  return true
}

exports.cli = cli
