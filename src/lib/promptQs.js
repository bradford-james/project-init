export const pushQuestions = () => {
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["JavaScript", "TypeScript"],
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
};

export const setOptsWithAnswers = answers => {
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  };
};
