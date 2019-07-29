import Listr from "listr";
import execa from "execa";
import { projectInstall } from "pkg-install";
import ncp from "ncp";

const copyTemplateFiles = async options => {
  const copy = promisify(ncp);
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
};

const initGit = async options => {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
};

export default new Listr([
  {
    title: "Copy project files",
    task: () => copyTemplateFiles(options)
  },
  {
    title: "Initialize git",
    task: () => initGit(options),
    enabled: () => options.git
  },
  {
    title: "Install dependancies",
    task: () =>
      projectInstall({
        cwd: options.targetDirectory
      }),
    skip: () =>
      !options.runInstall
        ? "Pass --install to automatically install dependancies"
        : undefined
  }
]);
