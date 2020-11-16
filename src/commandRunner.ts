import {spawnSync} from "child_process";
import {CommandWithMetadata} from "./interfaces";

export async function runCommand(command: CommandWithMetadata): Promise<void> {
  let listOfInstructions = command.run || [];
  if (typeof listOfInstructions === "string") {
    listOfInstructions = [listOfInstructions];
  }

  for (const currentInstruction of listOfInstructions) {
    spawnSync(currentInstruction, process.argv.slice(3), {
      cwd: command.directory,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
      }
    });
  }
}
