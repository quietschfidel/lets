#!/usr/bin/env node
import * as semver from "semver";
import {CommandLibrary} from "./commandLibrary";
import {runCommand} from "./commandRunner";
import * as configurationReader from "./configurationReader";
import {print, printError, printList, printUpdateInstructions} from "./consolePrinter";
import * as fileUtils from "./fileUtils";
import {showAllCommands} from "./help";
import {YamlConfigurations} from "./interfaces";
import {handleTabCompletion} from "./tabCompleter";

export async function run(userInput: string) {
  const commandLibrary = loadCommandsOrQuit();

  checkVersionIsUpToDate(commandLibrary.getMinimumExpectedApplicationVersion());

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
  const configurationFilename = ".lets.yml";

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

function checkVersionIsUpToDate(minimumExpectedApplicationVersion) {
  const currentApplicationVersion = process.env.npm_package_version;
  if (semver.lt(currentApplicationVersion, minimumExpectedApplicationVersion)) {
    printUpdateInstructions(minimumExpectedApplicationVersion, () => process.exit(1));
  }
}
