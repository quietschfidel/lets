import * as chalk from "chalk";
import {CommandLibrary} from "./commandLibrary";
import {print, printCommands} from "./consolePrinter";

export function showHelp(): void {
  const helpText: string[] = [];
  helpText.push(chalk.bold("\nLets - a command unifier"));

  helpText.push("How to use:");
  helpText.push("  lets <command>");
  helpText.push("  lets add-tab-completion");
  helpText.push("  lets remove-tab-completion");
  helpText.push("  lets help\n");

  print(helpText.join(`\n`));
}

export function showAllCommands(commandLibrary: CommandLibrary): void {
  print("Available commands:");
  printCommands(commandLibrary.getAllCommands());
}
