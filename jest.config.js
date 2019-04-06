const base = require("./jest.config.base.js");

module.exports = {
  ...base,
  projects: [
    "<rootDir>",
    "<rootDir>/packages/*/jest.config.js"
  ]
};
