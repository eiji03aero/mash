const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  testEnvironment: "node",
  globalSetup: "./__tests__/globalSetup.ts"
};
