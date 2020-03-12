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

const GIT_CREATE_REPO_ENDPOINT = 'https://api.github.com/user/repos'
const GIT_REMOTE_ENDPOINT = (ghUser, dirName) => `https://github.com/${ghUser}/${dirName}.git`

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

const _writeToInitMD = async tool => {
  const sourcePath = path.join(__dirname, getToolDir(tool), 'init.md')
  try {
    await access(sourcePath, fs.constants.R_OK)
    const targetPath = path.join(__dirname, STAGING_DIR, 'init.md')
    const initSource = fs.readFileSync(sourcePath)
    const initTarget = fs.readFileSync(targetPath)

    const initWrite = initTarget.toString('utf8').replace(`{${tool}}`, initSource)
    fs.writeFileSync(targetPath, initWrite)
    return true
  } catch (err) {
    return true
  }
}

const _writeToPackageJSON = async tool => {
  const sourcePath = path.join(__dirname, getToolDir(tool), 'init.json')
  try {
    await access(sourcePath, fs.constants.R_OK)
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
    return true
  } catch (err) {
    return true
  }
}

const _runToolInit = tool => {
  _writeToInitMD(tool)
  _writeToPackageJSON(tool)

  const sourcePath = path.join(__dirname, getToolDir(tool))
  const targetPath = path.join(__dirname, STAGING_DIR)
  copyFiles(sourcePath, targetPath, true)
}

const _setupPackageJson = dirName => {
  const packagePath = path.join(__dirname, STAGING_DIR, 'package.JSON')
  const rawdata = fs.readFileSync(packagePath)
  const packageJSON = JSON.parse(rawdata)

  packageJSON.scripts = {}
  packageJSON.name = dirName
  packageJSON.bin = {
    [dirName]: `bin/${dirName}.js`,
  }
  packageJSON.description = './README.md'
  packageJSON.dependencies = {}

  const packageWrite = JSON.stringify(packageJSON, null, 2)
  fs.writeFileSync(packagePath, packageWrite)
}

const _setupLicense = async dirPath => {
  const licenseType = await execa('npm', ['get', 'init.license'])
  const name = await execa('npm', ['get', 'init.author.name'])
  const license = await execa('npx', ['license', licenseType.all, '-o', name.all])
  const filePath = path.join(dirPath, 'LICENSE')
  fs.writeFile(filePath, license.all, err => {
    if (err) console.log(err)
  })
}

const _setupGit = async dirPath => {
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
}

exports.initTooling = {
  npm: async (dirName, dirPath) => {
    await execa('npm', ['init', '-y'], {
      cwd: dirPath,
    })

    const oldPath = path.join(dirPath, '/bin/bin.js')
    const newPath = path.join(dirPath, `/bin/${dirName}.js`)
    fs.renameSync(oldPath, newPath)

    _setupPackageJson(dirName)
  },
  common: async dirPath => {
    _runToolInit('common')
    await _setupLicense(dirPath)
  },
  formatter: () => _runToolInit('formatter'),
  linter: () => _runToolInit('linter'),
  logger: () => _runToolInit('logger'),
  tests: () => _runToolInit('tester'),
  version_control: async dirPath => {
    _runToolInit('version_control')
    await _setupGit(dirPath)
  },
  commit_linter: () => _runToolInit('commit_linter'),
  version_control_repo: () => _runToolInit('version_control_repo'),
  ci: () => _runToolInit('ci'),
}

exports.installDeps = async dirPath => {
  await execa('npm', ['install'], {
    cwd: dirPath,
  })
}

exports.setRemotes = {
  git: async (dirName, dirPath) => {
    const ghUser = process.env.GITHUB_USER
    const ghPassword = process.env.GITHUB_PASSWORD

    await axios
      .post(
        GIT_CREATE_REPO_ENDPOINT,
        { name: dirName },
        { auth: { username: ghUser, password: ghPassword } }
      )
      .catch(error => {
        console.log(error.response.data)
      })

    const gitRemoteEndPoint = GIT_REMOTE_ENDPOINT(ghUser, dirName)

    await execa('git', ['remote', 'add', 'origin', gitRemoteEndPoint], {
      cwd: dirPath,
    })
    await execa('npm', ['init', '-y'], {
      cwd: dirPath,
    })
    await execa('git', ['push', '-u', 'origin', 'master'], {
      cwd: dirPath,
    })
  },
}

exports.finalSetup = {
  cleanInitMD: targetDir => {
    const targetPath = path.join(targetDir, 'init.md')
    const initTarget = fs.readFileSync(targetPath)

    const regex = /{\w+}/g
    const initWrite = initTarget.toString('utf8').replace(regex, '')
    fs.writeFileSync(targetPath, initWrite)
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
