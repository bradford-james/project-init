// const getDefaults = opts => {
//   return {
//     formatting: 'prettier',
//     linting: 'eslint',
//     testing: 'jest',
//   }
// }

// const setQuestions = options => {
//   const questions = []
//   //ask formatter
//   if (!options.formatting) {
//     questions.push({
//       type: 'list',
//       name: 'formatting',
//       message: 'Choose a formatter:',
//       choices: ['prettier', 'other'],
//     })
//   }
//   //ask linter
//   //ask tester
//   return questions
// }

// async function promptQuestions(opts) {
//   let answers
//   try {
//     const questions = setQuestions(opts)
//     answers = await inquirer.prompt(questions)
//   } catch (err) {
//     // TODO set logging
//     console.log(`ERROR: ${err}`)
//   }
//   return answers
//   // TODO validation that all required fields are entered?
// }
