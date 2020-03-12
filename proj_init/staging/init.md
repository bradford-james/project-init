# Init Doc

## Explainer

You've set up a template for creating a local Node project.  The idea here is to quickly prototype a tool that may later be expanded upon or made available through a public repo.

You'll find set up a variety of developer tools to ensure clean, consistent, testable code, as well as version control.

Read the blurbs on the various tools below to get an idea of what is available.

## Tooling

{common}

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

{logger}

{tester}

{commit linter}

{version control}

{version control repo}

{ci}

{package repo}