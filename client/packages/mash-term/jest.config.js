const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  name: 'mash-term',
  displayName: 'mash-term',
  setupFiles: [
    "jest-canvas-mock"
  ],
};
