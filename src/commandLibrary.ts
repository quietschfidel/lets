import {
  CommandSearchResult,
  CommandsWithMetadata,
  CommandWithMetadata,
  YamlConfigurations
} from "./interfaces";
import {SchemaValidator} from "./schemaValidator";

export class CommandLibrary {
  private yamlConfigurations: YamlConfigurations;
  private allCommands: CommandsWithMetadata;
  private unparseableConfigFiles: string[];

  constructor(yamlConfigurations: YamlConfigurations) {
    this.yamlConfigurations = yamlConfigurations;
    this.unparseableConfigFiles = [];
    this.allCommands = this.getAllCommands();
  }

  public getAllCommands(): CommandsWithMetadata {
    // lazy loading to only go through all configurations once
    if (this.allCommands === undefined) {
      const commands: CommandsWithMetadata = {};
      const schemaValidator: SchemaValidator = new SchemaValidator();
      Object.entries(this.yamlConfigurations).forEach(([directoryName, yamlConfiguration]) => {
        if (schemaValidator.isValid(yamlConfiguration)) {
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
        } else {
          this.unparseableConfigFiles.push(directoryName);
        }
      });
      this.allCommands = commands;
    }
    return this.allCommands;
  }

  public getAllCommandNames(): string[] {
    return Object.keys(this.getAllCommands());
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

  public getUnparseableConfigFiles(): string[] {
    return this.unparseableConfigFiles;
  }
}
