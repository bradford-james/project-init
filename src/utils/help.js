const menus = {
  main: `
  cli-demo [command] <options>

    version ............ show package version
    help ............... show help menu for a command
  `
};

export default () => {
  console.log(menus.main);
};
