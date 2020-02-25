const menus = {
  main: `
  project-init [template] <option(s)>

    version .................... show package version
    help ....................... show help menu

    --Templates-------------------------

    node-cli-tool .............. Node implemented CLI Tool
    node-package ............... Node package

    --Options---------------------------

    --name, -n ................. name of the project
    --dir, -d .................. set directory for project
    --yes, -y .................. use defaults
    --install-dep, -i .......... install project dependancies
    --git, -g .................. set up GitHub repo
    --ci, -c ................... set up GitHub Actions
    --package, -p .............. publish to NPM repo

    Template is a required input.
    Name (-n) is a required input.
    Directory (-d) will default to CWD if not specified.
    Yes (-y) will default remaining options as follows:
      - install-dep:  true
      - git:          true
      - ci:           false
      - package:      false
    Otherwise these are required inputs.

    Any required inputs that aren't specified will be asked by the prompter.
  `,
}

module.exports = () => {
  console.log(menus.main)
}
