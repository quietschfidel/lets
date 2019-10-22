export interface Configurations {
  [directory: string]: Configuration;
}

export interface Configuration {
  readonly commands: Commands;
}

export interface Commands {
  [key: string]: Command;
}

export interface Command {
  readonly run: string;
  readonly description?: string;
}
