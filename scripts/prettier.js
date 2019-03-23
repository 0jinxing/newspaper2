const fs = require("fs");
const prettier = require("prettier");
const glob = require("glob");
const chalk = require('chalk');
const prettierConfigPath = require.resolve('../.prettierrc');

const getPrettierFiles = () => {
  return glob.sync('src/**/*.js*', { ignore: ['**/node_modules/**', 'build/**'] });
}

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
    console.error(e);
  }
});
