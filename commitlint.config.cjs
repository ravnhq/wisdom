const PRE_COMMITLINT_SUBJECTS = new Set(["Add extension release publishing pipeline"]);

module.exports = {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => PRE_COMMITLINT_SUBJECTS.has(message.split("\n")[0].trim())],
};
