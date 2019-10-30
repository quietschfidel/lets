import {YamlConfiguration} from "./interfaces";
import {SchemaValidator} from "./schemaValidator";

describe("isValid", () => {
  test("should be valid for correct format", () => {
    const correctV1SchemaImplementation: YamlConfiguration = {
      commands: {
        someCommand1: {run: "anything", description: "This is the best command"},
        anotherCommand: {run: "anything"},
      }
    };
    const schemaValidator = new SchemaValidator();
    expect(schemaValidator.isValid(correctV1SchemaImplementation)).toBeTruthy();
  });

  test("should not be valid for undefined/null/empty/totally wrong object", () => {
    const schemaValidator = new SchemaValidator();
    expect(schemaValidator.isValid(undefined)).toBeFalsy();
    expect(schemaValidator.isValid(null)).toBeFalsy();
    expect(schemaValidator.isValid({})).toBeFalsy();
    expect(schemaValidator.isValid({definitely: "notTheRightFormat"})).toBeFalsy();
  });

  test("should not be valid for missing required properties", () => {
    const structureWithMissingProperties: object = {
      commands: {
        someCommand1: {description: "This is the best command"}
      }
    };
    const schemaValidator = new SchemaValidator();
    expect(schemaValidator.isValid(structureWithMissingProperties)).toBeFalsy();
  });

  test("should allow additional properties", () => {
    const structureWithAdditionalProperties: object = {
      helloi: "foo",
      commands: {
        someCommand1: {run: "anything", description: "This is the best command"},
        anotherCommand: {run: "anything", wiedel: "dudel"},
      }
    };
    const schemaValidator = new SchemaValidator();
    expect(schemaValidator.isValid(structureWithAdditionalProperties)).toBeTruthy();
  });
});
