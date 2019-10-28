import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as uuidv4 from "uuid/v4";
import {runCommand} from "./commandRunner";
import {CommandWithMetadata} from "./interfaces";

let tmpDir;
let commandRunnerTmpDir;

beforeAll(() => {
  // Unfortunately, we cannot mock the file system as the commands below are executed outside the node
  // environment and would not respect the file system mock.
  tmpDir = os.tmpdir();
  commandRunnerTmpDir = path.join(tmpDir, "commandRunnerTmpDir");
  fs.mkdirSync(commandRunnerTmpDir, {recursive: true});
});

afterAll(() => {
  deleteRecursive(commandRunnerTmpDir);
});

describe("runCommand", () => {
  test("should execute the command writing output to a file", () => {
    const testUuid = uuidv4();
    const writeSingleLineToFileCommand: CommandWithMetadata = {
      name: "writeSingleUuidToFile",
      run: `echo ${testUuid} > singleLineToFileCommand.log`,
      description: "Writes a uuid to the log file",
      directory: `${commandRunnerTmpDir}`
    };

    runCommand(writeSingleLineToFileCommand);

    expect(fs.readFileSync(`${commandRunnerTmpDir}/singleLineToFileCommand.log`, "utf8"))
      .toEqual(expect.stringContaining(testUuid));
  });
  test("run multiple instructions", () => {
    const testUuid1 = uuidv4();
    const testUuid2 = uuidv4();

    const multiCommand: CommandWithMetadata = {
      name: "writeMultipleUuidsToFile",
      run: `echo ${testUuid1} > multiLineToFileCommand.log\necho ${testUuid2} >> multiLineToFileCommand.log`,
      description: "Writes two uuids to the log file",
      directory: `${commandRunnerTmpDir}`
    };

    runCommand(multiCommand);

    expect(fs.readFileSync(`${commandRunnerTmpDir}/multiLineToFileCommand.log`, "utf8"))
      .toEqual(expect.stringContaining(testUuid1));
    expect(fs.readFileSync(`${commandRunnerTmpDir}/multiLineToFileCommand.log`, "utf8"))
      .toEqual(expect.stringContaining(testUuid2));
  });
  test("run parameterized instruction", () => {
    // create external script
    const parameterLoggerPath = path.join(commandRunnerTmpDir, "parameterLogger.sh");
    fs.writeFileSync(parameterLoggerPath, "echo \"$@\" > parameterCommand.log");
    fs.chmodSync(parameterLoggerPath, "755");

    const parameterCommand: CommandWithMetadata = {
      name: "writeAllParametersToFile",
      run: "./parameterLogger.sh",
      description: "Writes all parameters passed to this command to the log file",
      directory: `${commandRunnerTmpDir}`
    };

    process.argv = [
      "ignoredBecauseThisIsUsuallyTheNodePath",
      "ignoredBecauseThisIsUsuallyTheNameOfTheExecutable",
      "ignoredBecauseThisIsUsuallyTheNameOfTheCommandToRun",
      "firstRealParameter",
      "secondRealParameter"
    ];
    runCommand(parameterCommand);

    expect(fs.readFileSync(`${commandRunnerTmpDir}/parameterCommand.log`, "utf8")).toEqual("firstRealParameter secondRealParameter\n");
  });
});

function deleteRecursive(directoryPath: string) {
  if (fs.existsSync(directoryPath) ) {
    fs.readdirSync(directoryPath).forEach((fileName) => {
      const currentFileOrDirectory = path.join(directoryPath, fileName);
      if (fs.lstatSync(currentFileOrDirectory).isDirectory()) {
        deleteRecursive(currentFileOrDirectory);
      } else {
        fs.unlinkSync(currentFileOrDirectory);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}
