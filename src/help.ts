import chalk from "chalk";
import {CommandLibrary} from "./commandLibrary";
import {print, printCommands} from "./consolePrinter";

export function showHelp() {
  const helpText: string[] = [];
  helpText.push(chalk.bold("\nProject Cheat Sheet"));

  helpText.push("How to use:");
  helpText.push("  lets <command>");
  helpText.push("  lets add-tab-completion");
  helpText.push("  lets remove-tab-completion");
  helpText.push("  lets help\n");

  print(helpText.join(`\n`));
}

export function showAllCommands(commandLibrary: CommandLibrary): void {
  showHelp();

  print("Available commands:");
  printCommands(commandLibrary.getAllCommands());
}
