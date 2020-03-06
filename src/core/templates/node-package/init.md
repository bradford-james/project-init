# Init Doc

## Explainer

You've set up a template for creating a Node Package.  Packaged code typically contains an interface (cli) or is designed to be used as a library/tool within another project (i.e. a logging tool, utility functions, etc)

You'll find set up a variety of developer tools to ensure clean, consistent, testable code, as well as management of versioning and releasing your package.

Read the blurbs on the various tools below to get an idea of what is available.

## Tooling

### Common

These are items that should be included in all projects:

* /README.md

This document shows on the front page of your GitHub repo and generally is treated as a TLDR for your package (the thing people will read to get a general idea if they're interested in using your tool).  Further documentation is then generally stored in a docuemntation directory that your README will point to.

* /LICENSE

Your legal mumbo-jumbo. Typical open source projects use the MIT license, this sets the baseline for how your package can be used and needs to be credited.  The license that has been generated was read from whatever is set as your default within your local npm CLI

check by: 
```
=> npm get init.license
```

### Formatter

Ensures consistent formatting across your project, mostly for readability.  Will keep line indents, characters per line, etc in check.

* **Uses:** Prettier
* **Config File:** /.prettierrc.js

prettier out of the box has a default for all of its settings, but these can be adjusted by declaring in the config as a key/value pairing.

i.e.   
```
semi: false
```
This setting will remove semi colons from statement/line endings as they aren't necessary for the JS compiler, but could be changed to 'true' if you would prefer to always use semi-colons.

### Linter

Where the formatter works to actively keep your code readable, linting is more concerned with checking your code for syntax issues (as well as formatting issues).  These would be like if you didn't close a parenthesis or declare a variable with var, const, or let.  The version of ESLint includes a 'style guide' that further enforces rules, like limiting how many arguemnets a funtion can, or reassigning parameters inside a function.  Some of these can seem arbitrary (and can be disbaled in the config file), but all rules are documented online and generally indicate bad practices.  The style guide used here is the 'AirBnB guide' (which interestly is somewhat considered an industry standard).

* **Uses:** ESLint
* **Config File:** /.eslintrc.js
* **Config File:** /.eslintignore

The config file allows for any rule to be set to one of three levels, error/warn/none.  Error will cause an error to be thrown when executing, warn will report the issue but not throw an error, and none will ignore the rule on all evaluated files.

The ignore file allows file/directory paths to be specified by glob patters (google it) to be excluded from linting.  This way you don't waste time checking linting on configuration files, test files, your dependancies (hopefully the respective maintainers are).

**Note:** the reason for using a formatter and a linter is that a linter more focuses on syntax issues and formatting that may cause a compiler error, where a formatter has much more expansive ascetic corrections.

### Logger

* **Uses:** Not yet implemented

### Tester

Tests are critical for preventing regressions and give developers confidence to undertake refactors.  Jest specifically is great for running unit and integration tests.  Mostly you'll set up assertions (x is equal to y, x returns an object, etc).  There are a few optional modes that have been set up in the package.json scripts:

* **Watch:** will watch for changes and runs tests after every save.  You can also specify small subsets of tests to run, specific files to watch, etc
* **Coverage:** will generate a code report and create a /coverage/ directory where you can view the coverage report
* **Debug:** will launch chrome's devtools to step through the code

Jest will execute any file named as *.test.js or in a /\_\_tests\_\_/ directory.  There is an example test in the /\_\_tests\_\_/test.js file 

* **Uses:** Jest
* **Config File:** /jest.config.js

Jest has a prompter for generating a config file that can be run w/
```
=> jest --init
```
but this project has been initialized with a general config file already.  You can delete that one and run the prompter if you'd prefer (has options for if testing code that will run in the browser, older node version, etc)

**Note:** a growing practice is TDD (Test Driven Development).  This involves writing tests *before* writing code, completing the feature enough to make the test run and then writing a test for more expansive functionality then writing the code that will make it pass.  Its a fairly iterative technique that requires some experience w/ writing tests to work fluidly, but is becoming a growing practice as it ensures that all written code is testable and serves as its own kind of documentation and scope control.

### Version Control

Version control is essential for tracking changes in code.  The goal should be to try work exclusive on a cohesive change, commit the code when complete, then move to the next feature/issue.  This makes versioning clear (i.e. don't refactor something that has to do with the interface if you are updating documentation or fixing a bug elsewhere).  The golden rule is to make commits small, so its more obvious what change was made and for what reason.

* **Uses:** Git
* **Config File:** /.gitignore

This project has been set up with a script to more effectively manage changees (beyond what the git cli offers):
```
=> npm run commit
```
This will run the formatter, then the linter, then the tester.  If both the linter and tester pass, then all changes are added to git staging, then commited.  This is to ensure the quality of the code being commited, prevent any regressions from being check in.

If you really don't want to run the validation tools, you can always commit by the following steps:
```
=> git add -A
=> git commit -m 'Enter a commit message describing your change'
```

### Commit Linter

* **Uses:** Commitizen & Commit Lint
* **Config File:** /commitlint.config.js

When commiting to version control you always have to enter a message, sometimes followed by a longer description.  A quick way to get an overview of the project history is to run:
```
=> git log --oneline
```
This will print all commits with the commit message.  This can get messy pretty fast and obscure the flow of changes if the messaging isn't clear or direct.  There are a few standards out there for enforcing clear, consistent messages, this just happens to be one of them.  

When using **npm run commit**, a prompter will launch after the validation scripts have run and ask a series a questions which will generate a formatted commit message (this is commitizen).  Afterwards, the tool Commit Lint will check that this message matches the enforced format.  If you just want to use **git commit -m 'message here'**, you won't have to go through the prompter, but the linter will still run so you'll need to follow the proper format.  This looks something like the following:

```
type(subject): message
```
In this case the dominant types are 'fix' & 'feature' (which will later tell our release tool how to bump the SemVer), but there are many types that are used like 'chore', 'refactor', 'documentation'.  The subject is one word describing the subject of the changes ('interface','prompter','data').  The message is less than 60 characters describing the change.  All characters of the type, subject, and message must be lower case.  Again, commitzen takes care of all of this.

### Version Control Repo

* **Uses:** GitHub

This is a remote repository, where you code is stored and can be viewed, forked, or cloned by just about anybody.  This way other contributors are able to view and work on your project.  As changes are committed locally (as described above), you can then push the changes to the remote repo.  In this case, we're using GitHub.  The tool automation will go ahead and set up a repo on GitHub with your project name, assuming you've set your credentials as environmental variables at the tool root directory (don't worry, just run the tool and it'll explain how to do this).

As you'll see below, this process is handled with CI and versioning with the script:
```
=> npm run release
```
Otherwise you can just use:
```
=> git push
```

### CI

CI stands for Continuous Integration.  This is roughly the idea that changes can be pushed to the remote repo's main branch at any time, by any permissioned contributor.  This is safeguarded by the use of automated validation like linters and automated tests.  There are a number of other things that can be checked, like ensuring the build is successful or code testing coverage hasn't regressed, but ultimately if the CI tool passes you can then run additional steps to release your code.

* **Uses:** GitHub Actions
* **Config File:** /.github/workflows/npmpublish.yml

* **Uses:** Semantic-Versioning
* **Config File:** /.releaserc
* /CHANGELOG.md

In this case, we're checking in the code to GitHub, running tests, and if successful, calling the release tool.  The release tool (Semantic-Versioning) will then read the recent commits (since the last publish to the GitHub) and determine if the code should be versioned.  This follows typical SemVer protocal, if there are any 'fix' commits it'll bump the patch number, if there are any features, the minor version number (major versions are denoted in a special way that commitzen helps with).

Semantic-Versioning also updates the version number in your package.json, as well as updating the Changelog with all recent commits and versions.  The config file will allow plugins to be used (to tell Semantic Versioning what to do if the code is versioned).

### Package Repo

* **Uses:** npmjs.com (NPM official)

Since this is a Node 'package', a plugin to the NPM remote repo has been included in Semantic-Versioning.  So if a commit to GitHub passes CI and is versioned, it will be published out to NPM.

NPM host all packages in the Node ecosystem and is actually where the tools set up in this template repo came from.  Publishing to NPM allows other users to download your code in a way that will either install it as a code dependancy in their own project, or install it globally and set the executable in your OS's path variable (which is how you can just type **proj-init commands-and-such** from anywhere and it just works).