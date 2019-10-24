#!/usr/bin/env node
import {CommandLibrary} from "./commandLibrary";
import {runCommand} from "./commandRunner";
import * as configurationReader from "./configurationReader";
import {print, printCommands, printError, printList, printSuccess} from "./consolePrinter";
import * as fileUtils from "./fileUtils";
import {YamlConfigurations} from "./interfaces";
import {handleTabCompletion} from "./tabCompleter";

export async function run(userInput: string) {
  const commandLibrary = loadCommandsOrQuit();

  // tab completion will stop here until it's completely finished and then call pcs again
  await handleTabCompletion(userInput, commandLibrary);

  const searchResult = commandLibrary.searchCommand(userInput);

  if (searchResult.exactMatch !== undefined) {
    print(`Found command '${searchResult.exactMatch.name}'`);
    runCommand(searchResult.exactMatch).catch((error) => {
      printError(`An unexpected error occured while running '${searchResult.exactMatch.name}'.\n`, error);
    });
  } else if (searchResult.suggestions !== undefined && searchResult.suggestions.length > 0) {
    printError(`Could not find command '${userInput}'.\n`);
    print("Did you mean?");
    printList(searchResult.suggestions);
  } else {
    printError(`Could not find command '${userInput}'.\n`);
    showAllCommands(commandLibrary);
  }
}

function loadCommandsOrQuit(): CommandLibrary {
  const configurationFilename = ".pcs.yml";

  const configurationFilepaths: string[] =
    fileUtils.onlyDirectoriesContainingFile(
      configurationFilename, fileUtils.resolveParents(
        fileUtils.resolveWorkingDirectory()));
  if (configurationFilepaths.length) {
    const configurations: YamlConfigurations = configurationReader.readConfigurations(configurationFilepaths);
    return new CommandLibrary(configurations);
  } else {
    process.exit();
    // throw new Error(`Could not find any configuration files called ${configurationFilename} in the directory tree.
    // Please see the project's Readme for instructions`);
  }
}

function showAllCommands(commandLibrary: CommandLibrary): void {
  print("Available commands:");
  printCommands(commandLibrary.getAllCommands());
}
