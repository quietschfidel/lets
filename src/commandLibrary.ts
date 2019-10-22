import {CommandsWithMetadata, YamlConfigurations} from "./interfaces";

export class CommandLibrary {
  private yamlConfigurations: YamlConfigurations;

  constructor(yamlConfigurations: YamlConfigurations) {
    this.yamlConfigurations = yamlConfigurations;
  }

  public getAllCommands(): CommandsWithMetadata {
    const commands: CommandsWithMetadata = {};
    Object.entries(this.yamlConfigurations).forEach(([directoryName, yamlConfiguration]) => {
      Object.entries(yamlConfiguration.commands).forEach(([commandName, command]) => {
        if (commands[commandName] === undefined) {
          commands[commandName] = {
            run: command.run,
            description: command.description,
            directory: directoryName
          };
        }
      });
    });
    return commands;
  }
}
