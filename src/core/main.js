const tasks = require('./utils/tasks')

// const getCnfgOptions = template => {}

// const setCnfgOptions = (template, defaults) => {}

// const addFeature = options => {}

const projInit = async (template, options) => {
  // ToDo validate options
  // ToDo get cnfg defaults
  await tasks(template, options)
}

// exports.getCnfgOptions = getCnfgOptions
// exports.setCnfgOptions = setCnfgOptions
// exports.addFeature = addFeature
exports.projInit = projInit
