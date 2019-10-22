import {Command, Commands, YamlConfigurations} from "./interfaces";

export class CommandLibrary {
  private yamlConfigurations: YamlConfigurations;

  constructor(yamlConfigurations: YamlConfigurations) {
    this.yamlConfigurations = yamlConfigurations;
  }

  public getAllCommands(): Commands {
    const commands: Commands = {};
    Object.entries(this.yamlConfigurations).forEach(([directoryName, yamlConfiguration]) => {
      Object.entries(yamlConfiguration.commands).forEach(([commandName, command]) => {
        commands[commandName] = command;
      });
    });
    return commands;
  }
}
