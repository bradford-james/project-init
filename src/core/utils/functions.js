const execa = require('execa')
const path = require('path')
const ncp = require('ncp')
const { promisify } = require('util')
const fs = require('fs')
const chalk = require('chalk')
// const pckg = require('../../../package.json')

const access = promisify(fs.access)
const copy = promisify(ncp)

const setDirectories = (template, options) => {
  const templateDir = path.join(__dirname, '../templates', template)
  const stagingDir = path.join(__dirname, '../staging')
  const targetDir =
    options.dirPath === 'cwd' || options.dirPath === ''
      ? path.join(process.cwd(), options.dirName)
      : path.resolve(process.cwd(), options.dirPath, options.dirName)

  return { templateDir, stagingDir, targetDir }
}

const checkDirectories = async (templateDir, stagingDir, targetDirectory) => {
  let testDir
  try {
    testDir = 'templateDir'
    await access(templateDir, fs.constants.R_OK)

    testDir = 'stagingDir'
    await access(stagingDir, fs.constants.R_OK)

    testDir = 'targetDirectory'
    await access(targetDirectory, fs.constants.R_OK)
    testDir = ''
  } catch (err) {
    console.error(`${chalk.red.bold('ERROR')} ${err} (${testDir})`)
    process.exit(1)
  }
}

const copyFiles = async (templateDir, targetDirectory) => {
  await copy(templateDir, targetDirectory, {
    clobber: false,
  }).catch(err => {
    console.log(err)
    throw new Error('problem with copying template directory')
  })
}

const makeMainDir = async dirName => {
  await fs.mkdir(dirName, { recursive: true }, err => {
    console.log(err)
  })
}

const initTooling = {
  npm: async dirPath => {
    await execa('npm', ['init', '-y'], {
      cwd: dirPath,
    })
  },
  license: async dirPath => {
    const licenseType = await execa('npm', ['get', 'init.license'])
    const name = await execa('npm', ['get', 'init.author.name'])
    const license = await execa('npx', ['license', licenseType.all, '-o', name.all])
    const filePath = path.join(dirPath, 'LICENSE')
    fs.writeFile(filePath, license.all, err => {
      console.log(err)
    })
  },
  formatter: () => {},
  linter: async dirPath => {
    await execa('npx', ['eslint', '--init'], {
      cwd: dirPath,
    })
  },
  tests: () => {},
}

const initGit = async dirPath => {
  await execa('git', ['init'], {
    cwd: dirPath,
  })
  await execa('npx', ['gitignore', 'node'], {
    cwd: dirPath,
  })
  await execa('git', ['add', '-A'], {
    cwd: dirPath,
  })
  await execa('git', ['commit', '-m', "'Initial Commit'"], {
    cwd: dirPath,
  })
  // await execa('git', ['remote', 'add', 'origin', 'GIT_REMOTE'], {
  //   cwd: dirPath,
  // })
  initTooling.npm()
  // await execa('git', ['push', '-u', 'origin', 'master'], {
  //   cwd: dirPath,
  // })
}

const addScripts = dirName => {
  const pckg = path.join(__dirname, '../staging/package.json')
  const rawdata = fs.readFileSync(pckg)
  const parsedPckg = JSON.parse(rawdata)

  parsedPckg.name = dirName

  parsedPckg.bin = {
    [dirName]: `bin/${dirName}.js`,
  }

  parsedPckg.description = './README.md'

  parsedPckg.scripts = {
    start: 'node bin/project-init.js',
    dev: 'env NODE_ENV=dev node bin/project-init.js',
    reset: 'node src/core/utils/reset.js local',
    test: 'jest',
    'test:coverage': 'jest --coverage',
    'test:watch': 'jest --watch',
    'test:debug': 'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand  --watch',
    format: 'npm run prettier -- --write',
    prettier: 'prettier --ignore-path .gitignore --write "**/*.+(js|json)"',
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix',
    commit: 'npm run format && npm run lint && npm run test && git add . && git cz',
    release: 'git push --follow-tags',
    'semantic-release': 'semantic-release',
  }

  parsedPckg.dependencies = {}

  parsedPckg.devDependencies = {
    prettier: '^1.19.1',
    eslint: '^6.8.0',
    'eslint-config-airbnb-base': '^14.0.0',
    'eslint-config-prettier': '^6.10.0',
    'eslint-plugin-import': '^2.20.1',
    'eslint-plugin-prettier': '^3.1.2',
    husky: '^4.2.1',
    '@commitlint/cli': '^8.3.5',
    '@commitlint/config-conventional': '^8.3.4',
    '@commitlint/prompt': '^8.3.5',
    'cz-conventional-changelog': '^3.1.0',
    'semantic-release': '^17.0.2',
    '@semantic-release/changelog': '^5.0.0',
    '@semantic-release/git': '^9.0.0',
    '@semantic-release/github': '^7.0.3',
    '@semantic-release/npm': '^7.0.2',
  }

  parsedPckg.husky = {
    hooks: {
      'pre-commit': '',
      'prepare-commit-msg': '',
      'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      'post-commit': '',
      'pre-push': '',
    },
  }

  parsedPckg.config = {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  }

  const setPckg = JSON.stringify(parsedPckg, null, 2)
  fs.writeFileSync(pckg, setPckg)
}

const verifySetup = async dirPath => {
  await execa('npm', ['test'], {
    cwd: dirPath,
  })
}

const installDeps = async dirPath => {
  await execa('npm', ['i'], {
    cwd: dirPath,
  })
}

const setRemotes = async dirPath => {
  await execa('npx', ['semantic-release-cli', 'setup'], {
    cwd: dirPath,
  })

  await execa('npm', ['run', 'commit'], {
    cwd: dirPath,
  })

  await execa('npm', ['run', 'release'], {
    cwd: dirPath,
  })
}

exports.setDirectories = setDirectories
exports.checkDirectories = checkDirectories
exports.copyFiles = copyFiles
exports.makeMainDir = makeMainDir
exports.initGit = initGit
exports.initTooling = initTooling
exports.addScripts = addScripts
exports.setRemotes = setRemotes
exports.verifySetup = verifySetup
exports.installDeps = installDeps
