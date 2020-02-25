const Listr = require('listr')
const {
  checkDirectories,
  copyFiles,
  initGit,
  makeMainDir,
  teardown,
  setDirectories,
} = require('./functions')

module.exports = async (template, options) => {
  const { templateDir, stagingDir, targetDir } = setDirectories(template, options)

  try {
    const tasks = new Listr([
      {
        title: 'Make Main Directory',
        task: () => makeMainDir(options.dirName),
      },
      {
        title: 'Validate Directories',
        task: () => checkDirectories(templateDir, stagingDir, targetDir),
      },
      {
        title: 'Copy project files to staging',
        task: () => copyFiles(templateDir, stagingDir),
      },
      // {
      //   title: 'Initialize tooling',
      //   task: () => ,
      // },
      // {
      //   title: 'Set scripts and dependancies',
      //   task: () => ,
      // },
      {
        title: 'Initialize git',
        task: () => initGit(stagingDir),
        enabled: () => options.git,
      },
      {
        title: 'Copy project files to main directory',
        task: () => copyFiles(stagingDir, targetDir),
      },
      // {
      //   title: 'Install dependancies',
      //   task: () =>
      //     projectInstall({
      //       cwd: options.targetDirectory,
      //     }),
      //   skip: () =>
      //     !options.runInstall ? 'Pass --install to automatically install dependancies' : undefined,
      // },
      // {
      //   title: 'Run linting/tests',
      //   task: () => ,
      // },
      // {
      //   title: 'Set up remotes',
      //   task: () => ,
      // },
      {
        title: 'Teardown operations',
        task: () => teardown(stagingDir),
      },
    ])
    await tasks.run(options)
    return
  } catch (err) {
    console.log(err)
  }
}

//  --------
//  SCRIPTS
// --------

/* 
-------------
Node CLI Tool
-------------

-- GIT AND NPM -------------------------------------

git init
npm init -y
npx license $(npm get init.license) -o "$(npm get init.author.name)" > LICENSE
npx gitignore node
git add .
git commit -m "Initial Commit"

-----------------
SET UP GIT REMOTE
git remote add origin GIT_REMOTE
-----------------

npm init -y
git push -u origin master

-- LINTING AND FORMATTING --------------------------

npm i -D eslint eslint-config-airbnb-base eslint-plugin-import
npm i -D prettier eslint eslint eslint-config-prettier eslint-plugin-prettier

-- GIT HOOKS AND COMMIT LINTING --------------------

npm i -D husky
npm install --save-dev husky @commitlint/cli @commitlint/config-conventional
commitizen init cz-conventional-changelog --save-dev --save-exact
npm i -D @commitlint/prompt

-- CI ----------------------------------------------

npx semantic-release-cli setup
----------
GH_TOKEN=
NPM_TOKEN=
----------

npm i -D @semantic-release/changelog @semantic-release/git
npm i -D @semantic-release/github

-- PACKAGE REPO ------------------------------------

npm i -D @semantic-release/npm

-- INITIALIZE --------------------------------------

npm i
npm run commit
npm run release

-- PACKAGES ----------------------------------------

"dependencies": {},
"devDependencies": {
  "@commitlint/cli": "^8.3.5",
  "@commitlint/config-conventional": "^8.3.4",
  "@commitlint/prompt": "^8.3.5",
  "@semantic-release/changelog": "^5.0.0",
  "@semantic-release/git": "^9.0.0",
  "@semantic-release/github": "^7.0.3",
  "@semantic-release/npm": "^7.0.2",
  "cz-conventional-changelog": "^3.1.0",
  "eslint": "^6.8.0",
  "eslint-config-airbnb-base": "^14.0.0",
  "eslint-config-prettier": "^6.10.0",
  "eslint-plugin-import": "^2.20.1",
  "eslint-plugin-prettier": "^3.1.2",
  "husky": "^4.2.1",
  "prettier": "^1.19.1",
  "semantic-release": "^17.0.2"
},

*/

/* 
------------
Node Package
------------


*/
