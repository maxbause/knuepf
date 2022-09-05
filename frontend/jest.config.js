module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['**/__specs__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  automock: false,
  resetMocks: false,
  setupFiles: [
    './specs/unit/spec-initializer.ts',
  ],
}
