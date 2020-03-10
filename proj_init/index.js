const path = require('path')
const fs = require('fs')
const tasks = require('./node/task_runner')

const CNFG_PATH = './templates.json'

exports.getCnfgDefaults = template => {
  const cnfgFile = path.join(__dirname, CNFG_PATH)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  return parsedCnfg.templates[template].tool_defaults
}

exports.getCnfgOptions = () => {
  const cnfgFile = path.join(__dirname, CNFG_PATH)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  return parsedCnfg.options
}

exports.setCnfgDefaults = (template, selections) => {
  const cnfgFile = path.join(__dirname, CNFG_PATH)
  const rawdata = fs.readFileSync(cnfgFile)
  const parsedCnfg = JSON.parse(rawdata)

  parsedCnfg.templates[template].tool_defaults = selections

  const setCnfg = JSON.stringify(parsedCnfg, null, 2)
  fs.writeFileSync(cnfgFile, setCnfg)
}

exports.projInit = async (template, instructions) => {
  await tasks(template, instructions)
  return { template, instructions }
}
