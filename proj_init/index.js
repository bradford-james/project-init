const path = require('path')
const fs = require('fs')
const nodeTaskRunner = require('./node_templates/task_runner')
const pythonTaskRunner = require('./python_templates/task_runner')

const CNFG_PATH = './templates.json'

const _getTemplateCnfg = () => {
  const filePath = path.join(__dirname, CNFG_PATH)
  const rawdata = fs.readFileSync(filePath)
  return JSON.parse(rawdata)
}

exports.getCnfgDefaults = template => {
  const templateCnfg = _getTemplateCnfg()
  return templateCnfg.templates[template].tool_defaults
}

exports.getCnfgOptions = () => {
  const templateCnfg = _getTemplateCnfg()
  return templateCnfg.options
}

exports.setCnfgDefaults = (template, selections) => {
  const templateCnfg = _getTemplateCnfg()
  templateCnfg.templates[template].tool_defaults = selections

  const setCnfg = JSON.stringify(templateCnfg, null, 2)
  const cnfgFilePath = path.join(__dirname, CNFG_PATH)
  fs.writeFileSync(cnfgFilePath, setCnfg)
}

exports.getProjectType = template => {
  const templateCnfg = _getTemplateCnfg()
  return templateCnfg.templates[template].type
}

exports.projInit = async (template, instructions) => {
  if (instructions.type === 'node') await nodeTaskRunner(template, instructions)
  if (instructions.type === 'python') await pythonTaskRunner(template, instructions)
  return { template, instructions }
}
