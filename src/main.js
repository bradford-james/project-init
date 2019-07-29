import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import tasks from "./lib/tasks";

const access = promisify(fs.access);

export const projectInit = async options => {
  // Set target and template directories
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };
  const templateDir = path.resolve(
    __dirname,
    "../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  // Check access privledges
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  // Run Tasks
  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
};
