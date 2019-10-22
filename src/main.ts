#!/usr/bin/env node
import chalk from "chalk";
import {CommandLibrary} from "./commandLibrary";
import * as configurationReader from "./configurationReader";
import {print, printCommands, printList, printSuccess} from "./consolePrinter";
import * as fileUtils from "./fileUtils";
import {YamlConfigurations} from "./interfaces";

console.info(chalk.green("Welcome to pcs!"));

const configurationFilename = ".pcs.yml";
const configurationFilepaths: string[] =
  fileUtils.onlyDirectoriesContainingFile(
    fileUtils.resolveParents(
      fileUtils.resolveWorkingDirectory()), configurationFilename);

if (configurationFilepaths.length) {
  printSuccess("\nFound the following possible configuration files:");
  printList(configurationFilepaths);

  print("\nListing all commands:");
  const configurations: YamlConfigurations = configurationReader.readConfigurations(configurationFilepaths);
  const commandLibrary = new CommandLibrary(configurations);
  printCommands(commandLibrary.getAllCommands());
}
