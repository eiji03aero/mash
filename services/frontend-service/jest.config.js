module.exports = {
  "roots": [
    "<rootDir>/__tests__"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testRegex": "spec.ts$",
  "moduleFileExtensions": [
    "ts",
    "js",
  ],
  verbose: true,
  collectCoverage: true,
  testEnvironment: "node",
  globalSetup: './__tests__/setup.ts'
};
