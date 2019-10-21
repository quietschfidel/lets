export interface Configurations extends Array<Configuration> {}

export interface Configuration {
  readonly commands: Commands;
}

export interface Commands extends Array<Command> {}

export interface Command {
  readonly run: string;
  readonly description?: string;
}
