import {CommandSearchResult, CommandsWithMetadata, CommandWithMetadata, YamlConfigurations} from "./interfaces";

export class CommandLibrary {
  private yamlConfigurations: YamlConfigurations;
  private allCommands: CommandsWithMetadata;

  constructor(yamlConfigurations: YamlConfigurations) {
    this.yamlConfigurations = yamlConfigurations;
    this.allCommands = this.getAllCommands();
  }

  public getAllCommands(): CommandsWithMetadata {
    // lazy loading to only go through all configurations once
    if (this.allCommands === undefined) {
      const commands: CommandsWithMetadata = {};
      Object.entries(this.yamlConfigurations).forEach(([directoryName, yamlConfiguration]) => {
        Object.entries(yamlConfiguration.commands).forEach(([commandName, command]) => {
          if (commands[commandName] === undefined) {
            commands[commandName] = {
              name: commandName,
              run: command.run,
              description: command.description,
              directory: directoryName
            };
          }
        });
      });
      this.allCommands = commands;
    }
    return this.allCommands;
  }

  public searchCommand(commandSearchString: string): CommandSearchResult {
    const suggestions: string[] = [];
    let exactMatch: CommandWithMetadata;

    Object.keys(this.allCommands).forEach((currentCommandName) => {
      const searchStringNormalized = commandSearchString.toLowerCase();
      const currentCommandNameNormalized = currentCommandName.toLowerCase();

      if (searchStringNormalized === currentCommandNameNormalized) {
        exactMatch = this.allCommands[currentCommandName];
      } else if (currentCommandNameNormalized.startsWith(searchStringNormalized)) {
        suggestions.push(currentCommandName);
      }
    });
    return exactMatch !== undefined ? {exactMatch} : {suggestions};
  }
}
