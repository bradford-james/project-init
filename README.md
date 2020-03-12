# Project-Init

CLI for initializing project workspace with tooling _(formatting, linting, version control, etc)_

<!-- BADGES -->

![GitHub package.json version](https://img.shields.io/github/package-json/v/bradford-james/proj-init)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bradford-james/proj-init/Node.js%20Package)

<!-- GIF w Recordit, ttystudio -->

## Table of Contents

- Example
- Installation
- Features
- Usage
- Documentation
- Tests
- FAQ
- Support
- License

## Example

```
=> proj-init node-package
```

## Installation

```
=> npm i -g @bradford-james/proj-init
```

## Features

Two packages are currently available

- **node-package:** linter, formatter, tester, version control, commit lint, version control repo, ci, package repo

```
=> proj-init node-package [project name]
```

- **node-base:** linter, formatter, tester, version control, commit lint (for local projects)

```
=> proj-init base [project name]
```

## Usage

Some other available options:

```
=> proj-init node-package -c
```

This will show current default configuration for this template type

```
=> proj-init node-package -s
```

This will allow you to set configuration options from currently available tools for each tool type

## Documentation

After your project template is created, an 'INIT.md' file will be created with tips and explanations of all the included tooling.

## Tests

## FAQ

## Support

This a CLI designed to initialize a local workspace based upon type, with options for downloading dependancies and initialize a local/remote git repository.

Credit due to: -https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
for the idea, but i've flushed it out a bit more and put my own spin on it.

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
