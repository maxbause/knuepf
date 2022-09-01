module.exports = {
  root: true,

  env: {
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'never'],
    'consistent-return': 'off',
    'vuejs-accessibility/label-has-for': [2, {
      required: {
        every: ['id'],
      },
    }],
    'max-len': ['error', 145],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/no-cycle': 'off',
    'no-underscore-dangle': 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      webpack: {
        config: require.resolve('@vue/cli-service/webpack.config.js'),
      },
    },
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
}
