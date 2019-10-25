import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as uuidv4 from "uuid/v4";
import {runCommand} from "./commandRunner";
import {CommandWithMetadata} from "./interfaces";

let writeSingleLineToFileCommand: CommandWithMetadata;
let multiCommand: CommandWithMetadata;
let parameterCommand: CommandWithMetadata;

let tmpDir;
let logFilePath;
let parameterLoggerPath;
let testUuid1;
let testUuid2;
let testUuid3;

beforeAll(() => {
  // Unfortunately, we cannot mock the file system as the commands below are executed outside the node
  // environment and would not respect the file system mock.
  tmpDir = os.tmpdir();
  logFilePath = path.join(tmpDir, "commandRunnerSpec.log");
  parameterLoggerPath = path.join(tmpDir, "parameterLogger.sh");
  fs.closeSync(fs.openSync(logFilePath, "w"));

  testUuid1 = uuidv4();
  testUuid2 = uuidv4();
  testUuid3 = uuidv4();

  writeSingleLineToFileCommand = {
    name: "writeUuid1ToFile",
    run: `echo ${testUuid1} > commandRunnerSpec.log`,
    description: "Writes a uuid to the log file",
    directory: "/tmp"
  };
  multiCommand = {
    name: "writeUuid2and3ToFile",
    run: `echo ${testUuid2} > commandRunnerSpec.log\necho ${testUuid3} >> commandRunnerSpec.log`,
    description: "Writes two uuids to the log file",
    directory: "/tmp"
  };
  parameterCommand = {
    name: "writeAllParametersToFile",
    run: "./parameterLogger.sh",
    description: "Writes all parameters passed to this command to the log file",
    directory: "/tmp"
  };
});
afterAll(() => {
  fs.unlinkSync(logFilePath);
  fs.unlinkSync(parameterLoggerPath);
});

describe("runCommand", () => {
  test("should execute the command writing output to a file", () => {
    runCommand(writeSingleLineToFileCommand);

    expect(fs.readFileSync("/tmp/commandRunnerSpec.log", "utf8")).toEqual(expect.stringContaining(testUuid1));
  });
  test("run multiple instructions", () => {
    runCommand(multiCommand);

    expect(fs.readFileSync("/tmp/commandRunnerSpec.log", "utf8")).toEqual(expect.stringContaining(testUuid2));
    expect(fs.readFileSync("/tmp/commandRunnerSpec.log", "utf8")).toEqual(expect.stringContaining(testUuid3));
  });
  test("run parameterized instruction", () => {
    // create external script
    fs.writeFileSync(parameterLoggerPath, "echo \"$@\" > commandRunnerSpec.log");
    fs.chmodSync(parameterLoggerPath, "755");

    process.argv = [
      "ignoredBecauseThisIsUsuallyTheNodePath",
      "ignoredBecauseThisIsUsuallyTheNameOfThePCSExecutable",
      "ignoredBecauseThisIsUsuallyTheNameOfThePCSCommandToRun",
      "firstRealParameter",
      "secondRealParameter"
    ];
    runCommand(parameterCommand);

    expect(fs.readFileSync("/tmp/commandRunnerSpec.log", "utf8")).toEqual("firstRealParameter secondRealParameter\n");
  });
});
