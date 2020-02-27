const tasks = require('./utils/tasks')
const { getCnfgDefaults } = require('./utils/functions')

const displayCnfgDefaults = template => {
  console.log(getCnfgDefaults(template))
}

const setCnfgDefaults = (template, defaults) => {}

const addFeature = options => {}

const projInit = async (template, options) => {
  // ToDo validate options
  // ToDo get cnfg defaults
  await tasks(template, options)
  // ToDo set output w/ cnfg options
  process.exit(0)
}

exports.displayCnfgDefaults = displayCnfgDefaults
exports.setCnfgDefaults = setCnfgDefaults
exports.addFeature = addFeature
exports.projInit = projInit
