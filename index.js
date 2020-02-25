const { parseArgs, validateInput, askCnfgDefaults } = require('./src/interface/main')
const { getCnfgOptions, setCnfgOptions, addFeature, projInit } = require('./src/core/main')

const cli = args => {
  const { template, options } = parseArgs(args)

  if (options.setCnfg === 'Y') {
    getCnfgOptions(template)
    const newDefaults = askCnfgDefaults(template)
    setCnfgOptions(template, newDefaults)
  } else if (template === 'add') {
    const setOptions = validateInput(options)
    addFeature(setOptions)
  } else {
    const setOptions = validateInput(options)
    projInit(template, setOptions)
  }
  return true
}

exports.cli = cli
