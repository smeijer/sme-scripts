const spawn = require('cross-spawn');

const { resolveBin } = require('../utils');

const result = spawn.sync(resolveBin('tsc'), ['--build', 'tsconfig.json'], {
  stdio: 'inherit',
});

process.exit(result.status);
