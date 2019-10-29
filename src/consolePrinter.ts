import chalk from "chalk";
import {CommandsWithMetadata} from "./interfaces";

export function print(text: string, chalkModifier?: (text: string) => void): void {
  console.log(chalkModifier === undefined ? text : chalkModifier(text));
}

export function printSuccess(text: string): void {
  print(text, chalk.green);
}

export function printError(text: string, error?: any): void {
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

export function printUpdateInstructions(expectedApplicationVersion: string, callback: () => void): void {
  const updateInstructions: string[] = [];
  updateInstructions.push(`Your configuration files require at least version ${expectedApplicationVersion} of 'lets'`);
  updateInstructions.push("Update by running 'npm i -g @tklae/lets'");
  printError(updateInstructions.join(`\n`));
  callback();
}
