#!/usr/bin/env node
import chalk from 'chalk';
import * as fileUtils from './file_utils';

console.info(chalk.green('Welcome to pcs!'));

let configurationFilepaths:string[] = fileUtils.resolveConfigurationPaths(fileUtils.resolveParents(fileUtils.resolveWorkingDirectory()));

if (configurationFilepaths.length) {
  console.info(chalk.green('\nFound the following possible configuration files:'));
  configurationFilepaths.forEach(configurationPath => {
    console.info(chalk.green(`- ${configurationPath}`));
  })
}
