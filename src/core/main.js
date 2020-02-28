const path = require('path')
const fs = require('fs')
const tasks = require('./utils/tasks')

const cnfgPath = '../config/cnfg.json'

const getCnfgDefaults = template => {
  const cnfgFile = path.join(__dirname, cnfgPath)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  return parsedCnfg.templates[template].tools
}

const getCnfgOptions = () => {
  const cnfgFile = path.join(__dirname, cnfgPath)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  return parsedCnfg.options
}

const setCnfgDefaults = (template, selections) => {
  const cnfgFile = path.join(__dirname, cnfgPath)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  const cnfgOpts = parsedCnfg.templates[template].tools
  cnfgOpts.forEach(opt => {
    const option = opt
    const toolType = option.type
    const selection = selections[toolType].replace(' (current)', '')
    option.default = selection
  })

  const setCnfg = JSON.stringify(parsedCnfg, null, 2)
  fs.writeFileSync(cnfgFile, setCnfg)
}

// const addFeature = options => {}

const setTooling = async template => {
  const defaultOpts = await getCnfgDefaults(template)

  return defaultOpts
}

const projInit = async (template, instructions) => {
  await tasks(template, instructions)
  // ToDo set output w/ cnfg options
  process.exit(0)
}

exports.getCnfgDefaults = getCnfgDefaults
exports.getCnfgOptions = getCnfgOptions
exports.setCnfgDefaults = setCnfgDefaults
// exports.addFeature = addFeature
exports.setTooling = setTooling
exports.projInit = projInit
