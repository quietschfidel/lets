import * as fs from "fs";
import * as mockfs from "mock-fs";
import * as configurationReader from "./configuration_reader";
import {Configuration, Configurations} from "./interfaces";

beforeAll(() => {
  const ymlContent = `
commands:
  someCommand1:
    run: run something
    description: Runs something
  someCommand2:
    run: run something else
`;

  mockfs({
    "/some/config/.pcs.yml": ymlContent,
    "/some/other/config/.pcs.yml": ymlContent
  });
});

afterAll(() => {
  mockfs.restore();
});

describe("read one configuration", () => {
  test("should read all commands in the given configuration", () => {
    const configuration: Configuration = configurationReader.readConfiguration("/some/config/.pcs.yml");

    expect(configuration.commands.someCommand1.run).toBe("run something");
    expect(configuration.commands.someCommand1.description).toBe("Runs something");

    expect(configuration.commands.someCommand2.run).toBe("run something else");
    expect(configuration.commands.someCommand2.description).toBeUndefined();
  });
});

describe("read multiple configurations", () => {
  test("should out them into a map with 'folder name -> configuration' mapping", () => {
    const configurations: Configurations = configurationReader.readConfigurations(["/some/config/.pcs.yml", "/some/other/config/.pcs.yml"]);

    expect(configurations["/some/config"].commands.someCommand1.run).toBe("run something");
    expect(configurations["/some/other/config"].commands.someCommand1.run).toBe("run something");
  });
});
