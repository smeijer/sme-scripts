const { ifAnyDep } = require('../utils');

module.exports = {
  extends: [
    require.resolve('eslint-config-smeijer'),
    require.resolve('eslint-config-smeijer/jest'),
    ifAnyDep('react', require.resolve('eslint-config-smeijer/react')),
    ifAnyDep('typescript', require.resolve('eslint-config-smeijer/typescript')),
  ].filter(Boolean),
  rules: {},
};
