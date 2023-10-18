const { defaults: tsjPreset } = require("ts-jest/presets")

/** @type {import('@jest/types').Config.ProjectConfig} */
module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
    "jest-runner",
    //"<rootDir>/node_modules/(react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|react-native-code-push)",
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.maestro/", "@react-native"],
  testEnvironment: "node",
  setupFiles: ["<rootDir>/test/setup.ts"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
}
