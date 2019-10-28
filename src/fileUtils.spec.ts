import * as mockfs from "mock-fs";
import * as process from "process";
import * as fileUtils from "./fileUtils";

beforeAll(() => {
  mockfs({
    "/path/with/config/.lets.yml": "any yaml content",
    "/path/without/config": {/** empty directory */}
  });
});

afterAll(() => {
  mockfs.restore();
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
  test("should give me all the paths which contain a config file called .lets.yml", () => {
    expect(fileUtils.onlyDirectoriesContainingFile(
      ".lets.yml",
      ["/path/with/config", "/path/without/config"],
    )).toStrictEqual(
      [
        "/path/with/config/.lets.yml",
      ]
    );
  });
  test("should return empty array if no directories contain a configuration file", () => {
    expect(fileUtils.onlyDirectoriesContainingFile(
      ".lets.yml",
      ["/path/without/config"],
    )).toStrictEqual(
      []
    );
  });
});
