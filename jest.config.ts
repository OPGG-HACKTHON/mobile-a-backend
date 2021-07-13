/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["/node_modules/"],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules"],

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "ts"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],

  transform: {
    "^.+\\.ts?$": "ts-jest",
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ["/node_modules/"],
  testTimeout: 30000,
};
