const path = require('path')
const chalk = require('chalk')
const { promptMissingInput, promptDefaults } = require('./utils/functions')

const display = {
  mainHelp: () =>
    console.log(`
  Use 'proj-init [template] --help' to see options available for each template
  => ${chalk.cyan('proj-init node-package --help')}
  `),
  ciHelp: () =>
    console.log(`
  If you want to setup a remote version control repository, set your credentials in a ${chalk.yellow(
    '.env'
  )} file at the root of your directory
    root directory: 
  => ${chalk.cyan(`cd ${path.join(__dirname, '../../')}`)}
  
  To setup GitHub access, write in .env file (replace ${chalk.cyan('username')} & ${chalk.cyan(
      'password'
    )} with your credentials):
  ${chalk.cyan(`  GITHUB_USER=username
    GITHUB_PASSWORD=password`)}
  
  Otherwise use the 'node-base' template to set up a local project
  => ${chalk.cyan('proj-init node-base <project_name>')}
  `),
  cnfgDefaults: defaultOpts => {
    console.log('')
    defaultOpts.forEach(opt => {
      console.log(`    tool: ${chalk.green(opt.type)} => default: ${chalk.green(opt.default)}`)
    })
    console.log('')
  },
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

const validateInput = async instr => {
  let { dirName, dirPath } = instr
  const { tools } = instr
  if (
    tools.find(tool => {
      return tool.type === 'ci'
    }) &&
    (!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD)
  ) {
    display.ciHelp()
    process.exit(0)
  }

  if (!dirName) dirName = await promptMissingInput(dirName)
  if (!dirPath) dirPath = 'cwd'

  return { dirName, dirPath, tools }
}

exports.validateInput = validateInput
exports.askCnfgDefaults = askCnfgDefaults
exports.display = display
