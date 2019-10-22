import {CommandLibrary} from "./commandLibrary";
import {Command, Commands, YamlConfiguration, YamlConfigurations} from "./interfaces";

describe("getAllCommands", () => {
  test("should return commands from all configuration ", () => {

    const yamlConfigurations: YamlConfigurations = {
      configuration1: {
        commands: {
          command1FromConfiguration1: {run: "anything"},
          command2FromConfiguration1: {run: "anything"}
        }
      },
      configuration2: {
        commands: {
          command1FromConfiguration2: {run: "anything"},
          command2FromConfiguration2: {run: "anything"}
        }
      }
    };
    const commandLibrary = new CommandLibrary(yamlConfigurations);
    expect(commandLibrary.getAllCommands().command1FromConfiguration1).toBeDefined();
    expect(commandLibrary.getAllCommands().command2FromConfiguration1).toBeDefined();
    expect(commandLibrary.getAllCommands().command1FromConfiguration2).toBeDefined();
    expect(commandLibrary.getAllCommands().command2FromConfiguration2).toBeDefined();
  });
});
