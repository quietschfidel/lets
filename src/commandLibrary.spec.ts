import {CommandLibrary} from "./commandLibrary";
import {Command, Commands, YamlConfiguration, YamlConfigurations} from "./interfaces";

describe("getAllCommands", () => {
  test("should return commands from all configurations and remove duplicates (by order of occurrence)", () => {

    const yamlConfigurations: YamlConfigurations = {
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
    const commandLibrary = new CommandLibrary(yamlConfigurations);
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
