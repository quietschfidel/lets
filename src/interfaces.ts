export interface YamlConfigurations {
  [directoryPath: string]: YamlConfiguration;
}

export interface YamlConfiguration {
  readonly commands: Commands;
}

export interface Commands {
  [commandName: string]: Command;
}

export interface Command {
  readonly run: string;
  readonly description?: string;
}

export interface CommandsWithMetadata {
  [commandName: string]: CommandWithMetadata;
}

export interface CommandWithMetadata extends Command {
  readonly name: string;
  readonly directory: string;
}

export interface CommandSearchResult {
  readonly exactMatch?: CommandWithMetadata;
  readonly suggestions?: string[];
}
