const inquirer = require('inquirer')

const promptDefaults = async prompts => {
  const questions = []
  prompts.forEach(prompt => {
    const key = Object.keys(prompt)[0]
    questions.push({
      type: 'list',
      name: `${key}`,
      message: `Choose ${key}:`,
      choices: prompt[key],
    })
  })
  const answers = await inquirer.prompt(questions)
  return answers
}

const promptMissingInput = async () => {
  const questions = []
  questions.push({
    type: 'input',
    name: 'dirName',
    message: 'Name of the new project:',
  })

  const answers = await inquirer.prompt(questions)
  return answers.dirName
}

exports.promptMissingInput = promptMissingInput
exports.promptDefaults = promptDefaults
