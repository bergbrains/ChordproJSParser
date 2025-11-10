// jest.config.js
export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js"],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/mocks/styleMock.js"
  },
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"]
};
