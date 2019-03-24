/**
 * copy to https://github.com/facebook/react/blob/master/scripts/prettier/index.js
 * prettier api doc https://prettier.io/docs/en/api.html
 *----------*****--------------
 *  prettier all js and all ts.
 *----------*****--------------
 */

const fs = require('fs');
const glob = require("glob");
const prettier = require('prettier');
const chalk = require('chalk');
const prettierConfigPath = require.resolve('../.prettierrc');

const getPrettierFiles = () => {
  return glob.sync('src/**/*.js*', { ignore: ['**/node_modules/**', 'build/**'] });
}

let didError = false;

const files = getPrettierFiles();

files.forEach(file => {
  const options = prettier.resolveConfig.sync(file, {
    config: prettierConfigPath,
  });
  const fileInfo = prettier.getFileInfo.sync(file);
  if (fileInfo.ignored) {
    return;
  }
  try {
    const input = fs.readFileSync(file, 'utf8');
    const withParserOptions = {
      ...options,
      parser: fileInfo.inferredParser,
    };
    const output = prettier.format(input, withParserOptions);
    if (output !== input) {
      fs.writeFileSync(file, output, 'utf8');
      console.log(chalk.green(`${file} is prettier`));
    }
  } catch (e) {
    didError = true;
  }
});

if (didError) {
  process.exit(1);
}
console.log(chalk.hex('#1890FF')('prettier success!'));