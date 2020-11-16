import * as jsonschema from "jsonschema";
import {YamlConfiguration} from "./interfaces";

export class SchemaValidator {
  private configurationSchema = {
    id: "/configuration",
    type: "object",
    properties: {
      schemaVersion: {type: "string"},
      commands: {$ref: "/commandsSchema"}
    },
    required: ["commands"]
  };

  private commandsSchema = {
    id: "/commandsSchema",
    type: "object",
    patternProperties: {
      "^.*$": {$ref: "/commandSchema"}
    }
  };

  private commandSchema = {
    id: "/commandSchema",
    type: "object",
    properties: {
      run: {type: "string"},
      description: {type: "string"}
    },
    required: ["run"]
  };

  private readonly validator;

  constructor() {
    this.validator = new jsonschema.Validator();
    this.validator.addSchema(this.configurationSchema, "/configuration");
    this.validator.addSchema(this.commandsSchema, "/commandsSchema");
    this.validator.addSchema(this.commandSchema, "/commandSchema");
  }

  public isValid(structureToValidate: YamlConfiguration | Record<string, unknown>): boolean {
    if (structureToValidate) {
      const validatorResult = this.validator.validate(structureToValidate, this.configurationSchema);
      return validatorResult.valid;
    }
    return false;
  }
}
