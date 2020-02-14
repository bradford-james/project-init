const commander = require('commander')
// const version = require('./cmds/version') // get from package.json

const program = new commander.Command()
// program.version(version())

program
  .command('base <name>')
  .description('template: local proj., default: linting/testing/formatting')
  .option('-d, --dir <dirPath>', 'target directory path')
  .option('-x, --exlude [ex]', "don't include: 'install', 'git'")
  .option('-i, --includ [inc]', "includes: 'ci'")
  .option('-t, --tech [dep]', 'includes defined tools: [to be added]')
  .option('-m, --manual', 'pick options for each handler')
  .action((name, cmdObj) => {
    console.log(`name: ${name}`)
    Object.entries(cmdObj).forEach(entry => {
      console.log(entry[1])
    })
  })

// program
//   .command('node-cli <name>')
//   .description('template: CLI tool, default: full CI')
//   .option('-d, --dir <dirPath>', 'target directory path')
//   .option('-x, --exclude <opts>', "don't include: 'install', 'git', 'ci'")
//   .option('-l, --local', 'excludes use of public repositories')
//   .option('-t, --tech <dep>', 'includes defined tools: [to be added]')
//   .option('-a, --alternate <alt>', "use alternate implementation: 'lint-otherlinter")
//   .action((name, cmdObj) => {
//     console.log(`name: ${name}, dir: ${cmdObj.dirPath}`)
//   })

// program
//   .command('node-package <name>')
//   .describe('template: node package, default: full CI/public repo')

program.parse(process.argv)
