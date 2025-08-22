module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@angular|@ngrx|ngx-|rxjs)'
  ],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  testMatch: ['**/+(*.)+(spec).+(ts)']
};