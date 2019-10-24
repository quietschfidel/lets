import {CommandLibrary} from "./commandLibrary";
import {Command, Commands, YamlConfiguration, YamlConfigurations} from "./interfaces";

let yamlConfigurations: YamlConfigurations;
let commandLibrary: CommandLibrary;

beforeAll(() => {
  yamlConfigurations = {
    configuration1: {
      commands: {
        command1FromConfiguration1: {run: "anything"},
        command2FromConfiguration1: {run: "anything"},
        duplicateCommand: {run: "anything"}
      }
    },
    configuration2: {
      commands: {
        command1FromConfiguration2: {run: "anything"},
        command2FromConfiguration2: {run: "anything"},
        duplicateCommand: {run: "anything"}
      }
    }
  };
  commandLibrary = new CommandLibrary(yamlConfigurations);
});

describe("getAllCommands", () => {
  test("should return commands from all configurations and remove duplicates (by order of occurrence)", () => {
    const allCommands = commandLibrary.getAllCommands();

    expect(allCommands.command1FromConfiguration1).toBeDefined();
    expect(allCommands.command1FromConfiguration1.directory).toBe("configuration1");

    expect(allCommands.command2FromConfiguration1).toBeDefined();
    expect(allCommands.command2FromConfiguration1.directory).toBe("configuration1");

    expect(allCommands.command1FromConfiguration2).toBeDefined();
    expect(allCommands.command1FromConfiguration2.directory).toBe("configuration2");

    expect(allCommands.command2FromConfiguration2).toBeDefined();
    expect(allCommands.command2FromConfiguration2.directory).toBe("configuration2");

    expect(allCommands.duplicateCommand).toBeDefined();
    expect(allCommands.duplicateCommand.directory).toBe("configuration1");
  });
});

describe("getAllCommandNames", () => {
  test("should return names of all commands from all configurations", () => {
    const allCommandNames = commandLibrary.getAllCommandNames();

    expect(allCommandNames.length).toBe(5);
    expect(allCommandNames).toEqual(expect.arrayContaining([
      "command1FromConfiguration1",
      "command2FromConfiguration1",
      "command1FromConfiguration2",
      "command2FromConfiguration2",
      "duplicateCommand"]));
  });
});

describe("searchCommand", () => {
  test("should return the Command if it's an exact match", () => {
    const searchResult = commandLibrary.searchCommand("command1FromConfiguration2");
    expect(searchResult.exactMatch.name).toBe("command1FromConfiguration2");
    expect(searchResult.suggestions).toBeUndefined();
  });

  test("should return the Command if it's an exact match case insensitive", () => {
    const searchResult = commandLibrary.searchCommand("Command1fromconfiguration2");
    expect(searchResult.exactMatch.name).toBe("command1FromConfiguration2");
    expect(searchResult.suggestions).toBeUndefined();
  });

  test("should return suggestions if it's a partial match", () => {
    const searchResult = commandLibrary.searchCommand("command1");
    expect(searchResult.exactMatch).toBeUndefined();
    expect(searchResult.suggestions.length).toBe(2);
    expect(searchResult.suggestions).toStrictEqual([
      "command1FromConfiguration1",
      "command1FromConfiguration2"
    ]);
  });
  test("should return suggestions case insensitive", () => {
    const searchResult = commandLibrary.searchCommand("CoMmaNd1");
    expect(searchResult.exactMatch).toBeUndefined();
    expect(searchResult.suggestions.length).toBe(2);
    expect(searchResult.suggestions).toStrictEqual([
      "command1FromConfiguration1",
      "command1FromConfiguration2"
    ]);
  });
});
