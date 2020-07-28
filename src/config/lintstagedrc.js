const {
  resolveSmeScripts,
  resolveBin,
  hasFile,
  hasDependency,
} = require('../utils');

const bin = resolveSmeScripts();
const doctoc = resolveBin('doctoc');

const checkTypes = hasDependency('typescript') && hasFile('tsconfig.json');

const should = {
  format: true,
  lint: true,
  test: true,
  'check-types': checkTypes,
};
const scriptArg = process.argv.slice(2).pop().split(',');
const didProvideScripts = scriptArg.every((script) => should[script]);

if (didProvideScripts) {
  for (const key of Object.keys(should)) {
    should[key] = scriptArg.includes(key);
  }
}

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.{js,jsx,json,yml,yaml,css,less,scss,sass,ts,tsx,md,mdx,gql,graphql,vue}': [
    should.format && `${bin} format`,
    should.lint && `${bin} lint`,
    should.test && `${bin} test`,
    should['check-types'] && `${bin} check-types`,
  ].filter(Boolean),
};
