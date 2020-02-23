const cli = require('./interface/main.js')

const executable = cli.parse(process.argv)

// const { parseArgsToOpts, promptQuestions } = require('./interface/functions')
// const help = require('./interface/help')
// const version = require('./interface/version')
// const projectInit = require('./project-init/main')

// // TODO add name arguement for naming top level
// // TODO Log all inits into lowdb by name and type
// // TODO add remote and set uplink with git
// // TODO other node/npm commands like npm init -y

// async function cli(args) {
//   const options = parseArgsToOpts(args)

//   switch (options.cmd) {
//     case 'help':
//       help()
//       break

//     case 'version':
//       version()
//       break

//     case 'template':
//       try {
//         const opts = await promptQuestions(options)
//         await projectInit(opts)
//         // TODO send options to project mgmt service
//       } catch (err) {
//         // TODO log error
//         console.log(err)
//       }
//       break

//     default:
//       // TODO error handling
//       break
//   }
// }

// exports.cli = cli
