import {execSync} from "child_process";
import {CommandWithMetadata} from "./interfaces";

export async function runCommand(command: CommandWithMetadata) {
  let listOfInstructions = command.run || [];
  if (typeof listOfInstructions === "string") {
    listOfInstructions = [listOfInstructions];
  }

  for (const currentInstruction of listOfInstructions) {
    execSync(currentInstruction, {
      cwd: command.directory,
      stdio: "inherit",
      env: {
        ...process.env,
      }
    });
  }
}
