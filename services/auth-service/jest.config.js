module.exports = {
  "roots": [
    "<rootDir>/"
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
  globalSetup: "./__tests__/globalSetup.ts"
};
