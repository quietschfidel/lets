import * as chalk from "chalk";
import {CommandsWithMetadata} from "./interfaces";
import {configurationFilename} from "./main";

export function print(text: string, chalkModifier?: (text: string) => void): void {
  console.log(chalkModifier === undefined ? text : chalkModifier(text));
}

export function printSuccess(text: string): void {
  print(text, chalk.green);
}

export function printError(text: string, error?: unknown): void {
  console.error(error ? chalk.red(text, error) : chalk.red(text));
}

export function printList(items: string[]): void {
  items.forEach((item) => {
    print(`  - ${item}`);
  });
}

export function printCommands(commands: CommandsWithMetadata, showSourceDirectory = false): void {
  const result: string[] = [];

  Object.keys(commands).sort().forEach((commandName) => {
    const currentCommand = commands[commandName];
    const description = (currentCommand.description || chalk.grey("No description available."))
      .replace(/\n$/g, "")
      .replace(/\n/g, `\n  `);
    const sourceDirectory = showSourceDirectory ? chalk.grey(` (in ${currentCommand.directory})`) : "";
    result.push(`${chalk.green(commandName)}${sourceDirectory}:\n  ${description}`);
  });

  print(result.join(`\n`));
}

export function printParsingFailedInstructions(unparseableConfigs: string[], callback: () => void): void {
  const updateInstructions: string[] = [];
  updateInstructions.push("Your configuration files could not be parsed successfully. Please check these files for errors:");
  unparseableConfigs.forEach((configPath) => {
    updateInstructions.push(`  -${configPath}/${configurationFilename}`);
  });
  updateInstructions.push("\nIf all configs seem correct you can also try updating 'lets' by running 'npm i -g @tklae/lets'");
  printError(updateInstructions.join(`\n`));
  callback();
}
