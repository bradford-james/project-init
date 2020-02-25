const inquirer = require('inquirer')

const setQuestions = options => {
  const questions = []

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a project template:',
      choices: ['node-cli-tool', 'node-package'],
    })
  }

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'dirName',
      message: 'Name of the new project:',
    })
  }

  if (!options.yes) {
    if (!options.installDeps) {
      questions.push({
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies?',
        default: true,
      })
    }

    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: true,
      })
    }

    if (!options.ci) {
      questions.push({
        type: 'confirm',
        name: 'ci',
        message: 'Set up CI?',
        default: false,
      })
    }

    if (!options.package) {
      questions.push({
        type: 'confirm',
        name: 'package',
        message: 'Is this a package?',
        default: false,
      })
    }
  }

  return questions
}

async function promptQuestions(options) {
  let answers
  try {
    const questions = setQuestions(options)
    answers = await inquirer.prompt(questions)
  } catch (err) {
    // TODO set logging
    console.log(err)
  }
  return answers
  // TODO validation that all required fields are entered
}

exports.promptQuestions = promptQuestions
