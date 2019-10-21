export interface Configurations extends Array<Configuration> {}

export interface Configuration {
  readonly commands: Commands;
}

export interface Commands extends Array<Command> {}

export Command {
  readonly run: string;
  readonly description?: string;
}
