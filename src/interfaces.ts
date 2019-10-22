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
