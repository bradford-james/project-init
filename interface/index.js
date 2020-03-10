const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { version } = require('../package.json')

exports.version = `v${version}`

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
    console.log(defaultOpts)
  },
}
exports.display = display

const _prompt = {
  cnfgDefaults: async prompts => {
    const questions = []
    prompts.forEach(({ tool, choices }) => {
      questions.push({
        type: 'list',
        name: `${tool}`,
        message: `Choose ${tool}:`,
        choices,
      })
    })
    const answers = await inquirer.prompt(questions)
    return answers
  },
  missingInput: async () => {
    const questions = []
    questions.push({
      type: 'input',
      name: 'dirName',
      message: 'Name of the new project:',
    })
    const answers = await inquirer.prompt(questions)
    return answers.dirName
  },
}

exports.promptCnfgDefaults = async (cnfgOptions, currDefaults) => {
  const prompts = []

  Object.entries(currDefaults).forEach(([tool, currentSelection]) => {
    const options = cnfgOptions[tool]
    const promptOpts = options.map(opt => (currentSelection === opt ? `${opt} (current)` : opt))
    prompts.push({ tool, choices: promptOpts })
  })

  const setDefaults = await _prompt.cnfgDefaults(prompts)
  Object.entries(setDefaults).forEach(([tool, selection]) => {
    setDefaults[tool] = selection.replace(' (current)', '')
  })
  return setDefaults
}

exports.validateInput = async instr => {
  let { dirName, dirPath } = instr
  const { noInstall, tools } = instr
  if (tools.ci && (!process.env.GITHUB_USER || !process.env.GITHUB_PASSWORD)) {
    display.ciHelp()
    process.exit(0)
  }

  if (!dirName) dirName = await _prompt.missingInput(dirName)
  if (!dirPath) dirPath = 'cwd'

  return { dirName, dirPath, noInstall, tools }
}
