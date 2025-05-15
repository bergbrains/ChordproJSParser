// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"],
};
