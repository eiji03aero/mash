const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  name: 'mash',
  displayName: 'mash',
  testEnvironment: "node",
  globalSetup: './__tests__/setup.ts'
};
