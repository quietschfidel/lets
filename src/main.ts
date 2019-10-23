#!/usr/bin/env node
import chalk from "chalk";
import {CommandLibrary} from "./commandLibrary";
import * as configurationReader from "./configurationReader";
import {print, printCommands, printError, printList, printSuccess} from "./consolePrinter";
import * as fileUtils from "./fileUtils";
import {YamlConfigurations} from "./interfaces";

console.info(chalk.green("Welcome to pcs!\n"));
const cliCommandInput = process.argv[2];
run(cliCommandInput);

function run(userInput: string) {

  const commandLibrary = loadConfigurations();

  if (!userInput) {
    showAllCommands(commandLibrary);
    return;
  }
  const searchResult = commandLibrary.searchCommand(userInput);

  if (searchResult.exactMatch !== undefined) {
    print(`Found command ${searchResult.exactMatch.name}`);
  } else if (searchResult.suggestions !== undefined && searchResult.suggestions.length > 0) {
    printError(`Could not find command '${userInput}'.\n`);
    print("Did you mean?");
    printList(searchResult.suggestions);
  } else {
    printError(`Could not find command '${userInput}'.\n`);
    showAllCommands(commandLibrary);
  }
}

function loadConfigurations(): CommandLibrary {
  const configurationFilename = ".pcs.yml";

  const configurationFilepaths: string[] =
    fileUtils.onlyDirectoriesContainingFile(
      configurationFilename, fileUtils.resolveParents(
        fileUtils.resolveWorkingDirectory()));
  if (configurationFilepaths.length) {

    // printSuccess("\nFound the following possible configuration files:");
    // printList(configurationFilepaths);
    const configurations: YamlConfigurations = configurationReader.readConfigurations(configurationFilepaths);
    return new CommandLibrary(configurations);
  } else {
    printError(`
    Could not find any configuration files called ${configurationFilename} in the directory tree.
    Please see the project's Readme for instructions`);
  }
}

function showAllCommands(commandLibrary: CommandLibrary): void {
  print("Available commands:");
  printCommands(commandLibrary.getAllCommands());
}
