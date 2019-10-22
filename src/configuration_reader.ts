import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import {Configuration, Configurations} from "./interfaces";

export function readConfigurations(paths: string[]): Configurations {
  const configurations: Configurations = {};
  paths.forEach((currentPath) => {
    const workingDirectory: string = path.dirname(currentPath);
    configurations[workingDirectory] = readConfiguration(currentPath);
  });
  return configurations;
}

export function readConfiguration(fullConfigurationPath: string): Configuration {
  return yaml.safeLoad(fs.readFileSync(fullConfigurationPath, "utf8"));
}
