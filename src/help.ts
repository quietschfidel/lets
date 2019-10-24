import chalk from "chalk";
import {CommandLibrary} from "./commandLibrary";
import {print, printCommands} from "./consolePrinter";

export function showHelp() {
  const helpText: string[] = [];
  helpText.push(chalk.bold("\nProject Cheat Sheet"));

  helpText.push("How to use:");
  helpText.push("  pcs <command>");
  helpText.push("  pcs add-tab-completion");
  helpText.push("  pcs remove-tab-completion");
  helpText.push("  pcs help\n");

  print(helpText.join(`\n`));
}

export function showAllCommands(commandLibrary: CommandLibrary): void {
  showHelp();

  print("Available commands:");
  printCommands(commandLibrary.getAllCommands());
}
