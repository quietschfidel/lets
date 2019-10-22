#!/usr/bin/env node
import chalk from "chalk";
import * as fileUtils from "./fileUtils";

console.info(chalk.green("Welcome to pcs!"));

const configurationFilename = ".pcs.yml";
const configurationFilepaths: string[] =
  fileUtils.onlyDirectoriesContainingFile(
    fileUtils.resolveParents(
      fileUtils.resolveWorkingDirectory()), configurationFilename);

if (configurationFilepaths.length) {
  console.info(chalk.green("\nFound the following possible configuration files:"));
  configurationFilepaths.forEach((configurationPath) => {
    console.info(chalk.green(`- ${configurationPath}`));
  });
}
