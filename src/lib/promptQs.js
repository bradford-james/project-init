export const setQuestions = options => {
  const questions = [];

  if (true) {
    questions.push({
      type: "input",
      name: "newDirName",
      message: "Name of new directory"
    });
  }

  const defaultTemplate = "Node";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  } else {
    if (!options.template) {
      questions.push({
        type: "list",
        name: "template",
        message: "Please choose which project template to use",
        choices: ["Node", "cli-tool", "rest-api"],
        default: defaultTemplate
      });
    }

    if (!options.git) {
      questions.push({
        type: "confirm",
        name: "git",
        message: "Initialize a git repository?",
        default: false
      });
    }
  }
  return questions;
};

export const setOptsWithAnswers = (options, answers) => {
  return {
    ...options,
    newDirName: options.newDirName || answers.newDirName,
    template: options.template || answers.template,
    git: options.git || answers.git
  };
};
