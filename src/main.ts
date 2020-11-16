#!/usr/bin/env node
import {CommandLibrary} from "./commandLibrary";
import {runCommand} from "./commandRunner";
import * as configurationReader from "./configurationReader";
import {print, printError, printList, printParsingFailedInstructions} from "./consolePrinter";
import * as fileUtils from "./fileUtils";
import {showAllCommands, showHelp} from "./help";
import {YamlConfigurations} from "./interfaces";
import {handleTabCompletion} from "./tabCompleter";

export const configurationFilename = ".lets.yml";

export async function run(userInput: string): Promise<void> {
  if (userInput === "help") {
    showHelp();
  }

  const commandLibrary = loadCommandsOrQuit();

  checkConfigParsingSuccessful(commandLibrary.getUnparseableConfigFiles());

  // tab completion will stop here until it's completely finished and then call lets again
  await handleTabCompletion(userInput, commandLibrary);

  if (userInput !== "help") {
    const searchResult = commandLibrary.searchCommand(userInput);

    if (searchResult.exactMatch !== undefined) {
      print(`Running command '${searchResult.exactMatch.name}'...\n`);
      runCommand(searchResult.exactMatch).catch((error) => {
        printError(`An unexpected error occured while running '${searchResult.exactMatch.name}'.\n`, error);
      });
    } else if (searchResult.suggestions !== undefined && searchResult.suggestions.length > 0) {
      printError(`Could not find command '${userInput}'.`);
      print("Did you mean?");
      printList(searchResult.suggestions);
    } else {
      printError(`Could not find command '${userInput}'.`);
      showAllCommands(commandLibrary);
    }
    process.exit(0);
  }
  showAllCommands(commandLibrary);
}

function loadCommandsOrQuit(): CommandLibrary {
  const configurationFilepaths: string[] =
    fileUtils.onlyDirectoriesContainingFile(
      configurationFilename, fileUtils.resolveParents(
        fileUtils.resolveWorkingDirectory()));
  if (configurationFilepaths.length) {
    const configurations: YamlConfigurations = configurationReader.readConfigurations(configurationFilepaths);
    return new CommandLibrary(configurations);
  } else {
    process.exit();
  }
}

function checkConfigParsingSuccessful(unparseableConfigFiles: string[]) {
  if (unparseableConfigFiles.length > 0) {
    printParsingFailedInstructions(unparseableConfigFiles, () => process.exit(1));
  }
}
