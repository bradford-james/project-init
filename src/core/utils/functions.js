const execa = require('execa')
const path = require('path')
const ncp = require('ncp')
const { promisify } = require('util')
const fs = require('fs')
const chalk = require('chalk')
const axios = require('axios')

const access = promisify(fs.access)
const copy = promisify(ncp)

const setDirectoryPaths = (template, options) => {
  const templateDir = path.join(__dirname, '../templates', template)
  const stagingDir = path.join(__dirname, '../staging')
  const targetDir =
    options.dirPath === 'cwd' || options.dirPath === ''
      ? path.join(process.cwd(), options.dirName)
      : path.resolve(process.cwd(), options.dirPath, options.dirName)

  return { templateDir, stagingDir, targetDir }
}

const makeDir = async dirName => {
  await fs.mkdir(dirName, { recursive: true }, err => {
    if (err) console.log(err)
  })
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
  linter: () => {
    // async dirPath => {
    //   await execa('npx', ['eslint', '--init'], {
    //     cwd: dirPath,
    //   })
  },
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
    await execa('git', ['commit', '-m', "'Initial Commit'"], {
      cwd: dirPath,
    })
  },
  commit_linter: () => {},
}

const includeTool = (options, tool) => {
  return !!options.find(el => {
    return el.type === tool
  })
}

const addScripts = (dirName, tools) => {
  const scripts = {}
  const devDependencies = {}
  const husky = {}
  const config = {}

  scripts.start = 'node bin/project-init.js'
  scripts.dev = 'env NODE_ENV=dev node bin/project-init.js'

  if (includeTool(tools, 'formatter')) {
    scripts.format = 'npm run prettier -- --write'
    scripts.prettier = 'prettier --ignore-path .gitignore --write "**/*.+(js|json)"'
    devDependencies.prettier = '^1.19.1'
  }

  if (includeTool(tools, 'linter')) {
    scripts.lint = 'eslint .'
    scripts['lint:fix'] = 'eslint . --fix'
    devDependencies.eslint = '^6.8.0'
    devDependencies['eslint-config-airbnb-base'] = '^14.0.0'
    devDependencies['eslint-config-prettier'] = '^6.10.0'
    devDependencies['eslint-plugin-import'] = '^2.20.1'
    devDependencies['eslint-plugin-prettier'] = '^3.1.2'
  }

  if (includeTool(tools, 'tester')) {
    scripts.test = 'jest'
    scripts['test:coverage'] = 'jest --coverage'
    scripts['test:watch'] = 'jest --watch'
    scripts['test:debug'] =
      'node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand  --watch'
  }

  if (includeTool(tools, 'version_control')) {
    scripts.commit = 'npm run format && npm run lint && npm run test && git add . && git cz'
    husky.hooks = {
      'pre-commit': '',
      'prepare-commit-msg': '',
      'commit-msg': '',
      'post-commit': '',
      'pre-push': '',
    }
  }

  if (includeTool(tools, 'commit-linter')) {
    devDependencies.husky = '^4.2.1'
    devDependencies['@commitlint/cli'] = '^8.3.5'
    devDependencies['@commitlint/config-conventional'] = '^8.3.4'
    devDependencies['@commitlint/prompt'] = '^8.3.5'
    husky.hooks['commit-msg'] = 'commitlint -E HUSKY_GIT_PARAMS'
  }

  if (includeTool(tools, 'version_control_repo')) {
    scripts.release = 'git push --follow-tags'
  }

  if (includeTool(tools, 'ci')) {
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

  const pckg = path.join(__dirname, '../staging/package.json')
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

const setRemotes = {
  setGit: async (dirName, dirPath) => {
    const ghUser = process.env.GITHUB_USER
    const ghPassword = process.env.GITHUB_PASSWORD

    await axios
      .post(
        'https://api.github.com/user/repos',
        { name: dirName },
        { auth: { username: ghUser, password: ghPassword } }
      )
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(error.response.data)
      })

    const gitRemoteEndPoint = `https://github.com/${ghUser}/${dirName}.git`

    await execa('git', ['remote', 'add', 'origin', gitRemoteEndPoint], {
      cwd: dirPath,
    })

    initTooling.npm()

    await execa('git', ['push', '-u', 'origin', 'master'], {
      cwd: dirPath,
    })
  },
}

const finalSetup = {
  gitCommit: async dirPath => {
    await execa('npm', ['run', 'commit'], {
      cwd: dirPath,
    })
  },

  ciTrigger: async dirPath => {
    await execa('npm', ['run', 'release'], {
      cwd: dirPath,
    })
  },
}

const ciInit = async dirPath => {
  await execa('npx', ['semantic-release-cli', 'setup'], {
    cwd: dirPath,
  })
}

exports.setDirectoryPaths = setDirectoryPaths
exports.checkDirectories = checkDirectories
exports.copyFiles = copyFiles
exports.makeDir = makeDir
exports.initTooling = initTooling
exports.addScripts = addScripts
exports.setRemotes = setRemotes
exports.verifySetup = verifySetup
exports.installDeps = installDeps
exports.finalSetup = finalSetup
exports.ciInit = ciInit
