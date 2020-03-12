const execa = require('execa')
const path = require('path')
const ncp = require('ncp')
const { promisify } = require('util')
const fs = require('fs')
const chalk = require('chalk')
const axios = require('axios')

const access = promisify(fs.access)
const copy = promisify(ncp)

const TEMPLATE_DIR = './project_types'
const STAGING_DIR = '../staging'
const getToolDir = tool => `tooling/${tool}`

exports.setDirectoryPaths = (template, options) => {
  const templateDir = path.join(__dirname, TEMPLATE_DIR, template)
  const stagingDir = path.join(__dirname, STAGING_DIR)
  const targetDir =
    options.dirPath === 'cwd' || options.dirPath === ''
      ? path.join(process.cwd(), options.dirName)
      : path.resolve(process.cwd(), options.dirPath, options.dirName)

  return { templateDir, stagingDir, targetDir }
}

exports.makeDir = async dirName => {
  await fs.mkdir(dirName, { recursive: true }, err => {
    if (err) console.log(err)
  })
}

exports.checkDirectories = async (templateDir, stagingDir, targetDirectory) => {
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

const copyFiles = async (templateDir, targetDirectory, filterFlag = false) => {
  try {
    const filter = filterFlag
      ? fileName =>
          fileName !== path.join(templateDir, 'init.md') &&
          fileName !== path.join(templateDir, 'init.json')
      : true
    await copy(templateDir, targetDirectory, {
      clobber: false,
      filter,
    })
  } catch (err) {
    if (err) {
      console.log(err)
      throw new Error('problem with copying template directory')
    }
  }
}

exports.copyFiles = copyFiles

const _writeToInitMD = tool => {
  const sourcePath = path.join(__dirname, getToolDir(tool), 'init.md')
  const targetPath = path.join(__dirname, STAGING_DIR, 'init.md')
  const initSource = fs.readFileSync(sourcePath)
  const initTarget = fs.readFileSync(targetPath)

  const initWrite = initTarget.toString('utf8').replace(`{${tool}}`, initSource)
  fs.writeFileSync(targetPath, initWrite)
}

const _writeToPackageJSON = tool => {
  const sourcePath = path.join(__dirname, getToolDir(tool), 'init.json')
  const sourceRawData = fs.readFileSync(sourcePath)
  const initSource = JSON.parse(sourceRawData)

  const targetPath = path.join(__dirname, STAGING_DIR, 'package.json')
  const targetRawData = fs.readFileSync(targetPath)
  const initTarget = JSON.parse(targetRawData)

  Object.keys(initSource).forEach(key => {
    if (initTarget[key]) {
      initTarget[key] = { ...initTarget[key], ...initSource[key] }
    } else {
      initTarget[key] = initSource[key]
    }
  })

  const initWrite = JSON.stringify(initTarget, null, 2)
  fs.writeFileSync(targetPath, initWrite)
}

const _runToolInit = tool => {
  _writeToInitMD(tool)
  _writeToPackageJSON(tool)

  const sourcePath = path.join(__dirname, getToolDir(tool))
  const targetPath = path.join(__dirname, STAGING_DIR)
  copyFiles(sourcePath, targetPath, true)
}

exports.initTooling = {
  npm: async dirPath => {
    await execa('npm', ['init', '-y'], {
      cwd: dirPath,
    })
    const packagePath = path.join(__dirname, STAGING_DIR, 'package.JSON')
    const rawdata = fs.readFileSync(packagePath)
    const packageJSON = JSON.parse(rawdata)

    packageJSON.scripts = {}

    const packageWrite = JSON.stringify(packageJSON, null, 2)
    fs.writeFileSync(packagePath, packageWrite)
  },
  common: () => {},
  license: async dirPath => {
    const licenseType = await execa('npm', ['get', 'init.license'])
    const name = await execa('npm', ['get', 'init.author.name'])
    const license = await execa('npx', ['license', licenseType.all, '-o', name.all])
    const filePath = path.join(dirPath, 'LICENSE')
    fs.writeFile(filePath, license.all, err => {
      if (err) console.log(err)
    })
  },
  formatter: () => {
    _runToolInit('formatter')
  },
  linter: () => {
    _runToolInit('linter')
  },
  logger: () => {},
  tests: () => {},
  git: async (dirName, dirPath) => {
    await execa('git', ['init'], {
      cwd: dirPath,
    })
    await execa('npx', ['gitignore', 'node'], {
      cwd: dirPath,
    })
    await execa('git', ['add', '-A'], {
      cwd: dirPath,
    })
    await execa('git', ['commit', '-m', 'Initial Commit'], {
      cwd: dirPath,
    })
  },
  commit_linter: () => {},
}

exports.addScripts = (dirName, tools) => {
  const scripts = {}
  const devDependencies = {}
  const husky = {}
  const config = {}

  scripts.start = 'node bin/project-init.js'
  scripts.dev = 'env NODE_ENV=dev node bin/project-init.js'

  if (tools.tester) {
    scripts.test = 'jest'
    scripts['test:coverage'] = 'jest --coverage'
    scripts['test:watch'] = 'jest --watch'
    scripts['test:debug'] =
      'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand  --watch'
  }

  if (tools.version_control) {
    scripts.commit = 'npm run format && npm run lint && npm run test && git add . && git cz'
    husky.hooks = {
      'pre-commit': '',
      'prepare-commit-msg': '',
      'commit-msg': '',
      'post-commit': '',
      'pre-push': '',
    }
  }

  if (tools.commit_linter) {
    devDependencies.husky = '^4.2.1'
    devDependencies['@commitlint/cli'] = '^8.3.5'
    devDependencies['@commitlint/config-conventional'] = '^8.3.4'
    devDependencies['@commitlint/prompt'] = '^8.3.5'
    husky.hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS'
  }

  if (tools.version_control_repo) {
    scripts.release = 'git push --follow-tags'
  }

  if (tools.ci) {
    scripts['semantic-release'] = 'semantic-release'
    devDependencies['cz-conventional-changelog'] = '^3.1.0'
    devDependencies['semantic-release'] = '^17.0.2'
    devDependencies['@semantic-release/changelog'] = '^5.0.0'
    devDependencies['@semantic-release/git'] = '^9.0.0'
    devDependencies['@semantic-release/github'] = '^7.0.3'
    devDependencies['@semantic-release/npm'] = '^7.0.2'
    config.commitizen = {
      path: './node_modules/cz-conventional-changelog',
    }
  }

  const pckg = path.join(__dirname, STAGING_DIR, 'package.json')
  const rawdata = fs.readFileSync(pckg)
  const parsedPckg = JSON.parse(rawdata)

  parsedPckg.name = dirName
  parsedPckg.bin = {
    [dirName]: `bin/${dirName}.js`,
  }
  parsedPckg.description = './README.md'
  parsedPckg.scripts = scripts
  parsedPckg.dependencies = {}
  parsedPckg.devDependencies = devDependencies
  parsedPckg.husky = husky
  parsedPckg.config = config

  const setPckg = JSON.stringify(parsedPckg, null, 2)
  fs.writeFileSync(pckg, setPckg)
}

exports.installDeps = async dirPath => {
  await execa('npm', ['i'], {
    cwd: dirPath,
  })
}

exports.setRemotes = {
  setGit: async (dirName, dirPath) => {
    const ghUser = process.env.GITHUB_USER
    const ghPassword = process.env.GITHUB_PASSWORD

    await axios
      .post(
        'https://api.github.com/user/repos',
        { name: dirName },
        { auth: { username: ghUser, password: ghPassword } }
      )
      .catch(error => {
        console.log(error.response.data)
      })

    const gitRemoteEndPoint = `https://github.com/${ghUser}/${dirName}.git`

    await execa('git', ['remote', 'add', 'origin', gitRemoteEndPoint], {
      cwd: dirPath,
    })

    // initTooling.npm()

    await execa('git', ['push', '-u', 'origin', 'master'], {
      cwd: dirPath,
    })
  },
}

exports.finalSetup = {
  verifySetup: async dirPath => {
    await execa('npm', ['test'], {
      cwd: dirPath,
    })
  },
  gitCommit: async dirPath => {
    await execa('git', ['add', '-A'], {
      cwd: dirPath,
    })
    await execa('git', ['commit', '-m', 'chore(template): template setup complete'], {
      cwd: dirPath,
    })
  },
}
