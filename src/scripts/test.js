/* eslint-disable import/order */
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const isCI = require('is-ci');

const { hasPkgProp, parseEnv, hasFile } = require('../utils');

const args = process.argv.slice(2);
const isPreCommit = parseEnv('SCRIPTS_PRE-COMMIT', false);

const watch =
  !isCI &&
  !isPreCommit &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : [];

const config =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')
    ? ['--config', JSON.stringify(require('../config/jest.config'))]
    : [];

if (isPreCommit) {
  config.push('--findRelatedTests');
}

// eslint-disable-next-line jest/no-jest-import
require('jest').run([...config, ...watch, ...args]);
