const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  displayName: 'mash-term',
  setupFiles: [
    "jest-canvas-mock"
  ],
};
