import * as mock from "mock-fs";
import * as process from "process";
import * as fileUtils from "./file_utils";

beforeAll(() => {
  mock({
    "/path/with/config/.pcs.yml": "any yaml content",
    "/path/without/config": {/** empty directory */}
  });
});

afterAll(() => {
  mock.restore();
});

describe("resolveWorkingDirectory", () => {
  test("should give me the current working directory", () => {
    const spy = jest.spyOn(process, "cwd");
    spy.mockReturnValue("/current/working/directory");

    expect(fileUtils.resolveWorkingDirectory()).toBe("/current/working/directory");
  });
});

describe("resolveParents", () => {
  test("should give current path and all parent directories", () => {
    expect(fileUtils.resolveParents("/some/nested/path")).toStrictEqual(
      [
        "/some/nested/path",
        "/some/nested",
        "/some",
        "/"
      ]
    );
  });

  test("should remove trailing slash on paths", () => {
    expect(fileUtils.resolveParents("/somePath/")).toStrictEqual(
      [
        "/somePath",
        "/"
      ]
    );
  });
});

describe("resolveConfigurationPaths", () => {
  test("should give me all the paths which contain a config file called .pcs.yml", () => {
    expect(fileUtils.onlyDirectoriesContainingFile(
      ["/path/with/config", "/path/without/config"],
      ".pcs.yml"
    )).toStrictEqual(
      [
        "/path/with/config",
      ]
    );
  });
  test("should return empty array if no directories contain a configuration file", () => {
    expect(fileUtils.onlyDirectoriesContainingFile(
      ["/path/without/config"],
      ".pcs.yml"
    )).toStrictEqual(
      []
    );
  });
});
