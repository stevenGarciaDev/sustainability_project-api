module.exports = {
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setupAfterEnv.js'],
};
