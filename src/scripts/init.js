const fs = require('fs');
const { cosmiconfigSync } = require('cosmiconfig');
const { fromRoot, hasFile, hereRelative } = require('../utils');

const appRoot = fromRoot('.');

const getConfig = (module) => cosmiconfigSync(module).search(appRoot);
const write = (file, data) => fs.writeFileSync(fromRoot(file), data, { encoding: 'utf-8' });

const ignore = ['node_modules', 'coverage', 'dist'].join('\n');

const templates = [
  { file: '.gitignore', data: ignore },
  { module: 'eslint', file: '.eslintrc.js', data: `module.exports = { extends: './node_modules/sme-scripts/eslint.js' }` },
  { file: '.eslintignore', data: ignore },
  { module: 'prettier', file: '.prettierrc.js', data: `module.exports = require('sme-scripts/prettier')` },
  { file: '.prettierignore', data: ignore },
  { module: 'husky', file: '.huskyrc.js', data: `module.exports = require('sme-scripts/husky')` },
];

const scripts = {
  'build': 'sme-scripts build',
  'check-types': 'sme-scripts check-types',
  format: 'sme-scripts format && sme-scripts lint --fix',
  lint: 'sme-scripts lint',
  test: 'sme-scripts test',
}

for (const template of templates) {
  if (template.module && getConfig(template.module)) {
    console.log(`skipped ${template.file}`);
    continue;
  }

  if (!template.module && fs.existsSync(template.file)) {
    console.log(`skipped ${template.file}`);
    continue;
  }

  write(template.file, template.data);
  console.log(`created ${template.file}`);
}

if (hasFile('package.json')) {
  const pkgPath = fromRoot('package.json');
  const json = JSON.parse(fs.readFileSync(pkgPath, { encoding: 'utf-8' }));
  json.scripts = json.scripts || {};

  let addedScripts = [];
  for (let script of Object.keys(scripts)) {
    if (json.scripts[script]) {
      continue;
    }

    addedScripts.push(script);
    json.scripts[script] = scripts[script];
  }

  if (addedScripts.length > 0) {
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2), { encoding: 'utf-8' });
    console.log(`added ${addedScripts.length} script${addedScripts.length !== 1 ? 's' : ''} to package.json#scripts`);
  } else {
    console.log(`skipped package.json#scripts`);
  }
}

