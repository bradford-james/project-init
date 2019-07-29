import minimist from "minimist";
import inquirer from "inquirer";
import { projectInit } from "./main";
import { pushQuestions, setOptsWithAnswers } from "./lib/promptQs";
import help from "./utils/help";
import version from "./utils/version";

// TODO add name arguement for naming top level
// TODO Log all inits into lowdb by name and type
// TODO add remote and set uplink with git
// TODO other node/npm commands like npm init -y

const parseArgsToOpts = rawArgs => {
  const args = minimist(rawArgs.slice(2), {
    boolean: ["git", "yes", "install", "help", "version"],
    alias: { g: "git", y: "yes", i: "install", h: "help", v: "version" },
    default: { git: false, yes: false, install: false }
  });

  if (args._[0] === "help" || args.help || args.h) return { cmd: "help" };
  if (args._[0] === "version" || args.version || args.v)
    return { cmd: "version" };

  return {
    cmd: "template",
    template: args._[0],
    git: args.git,
    skipPrompts: args.yes,
    runInstall: args.install
  };
};

const promptQuestions = async options => {
  const defaultTemplate = "Node";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  pushQuestions();
  const answers = await inquirer.prompt(questions);
  return setOptsWithAnswers(answers);
};

export async function cli(args) {
  let options = parseArgsToOpts(args);
  switch (options.cmd) {
    case "help":
      help();
      break;
    case "version":
      version();
      break;
    default:
      let options = await promptQuestions(opts);
      await projectInit(options);
  }
}
