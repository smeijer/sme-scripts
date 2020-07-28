const { resolveSmeScripts } = require('../utils');

const smeScripts = resolveSmeScripts();

module.exports = {
  hooks: {
    'pre-commit': `"${smeScripts}" pre-commit`,
  },
};
