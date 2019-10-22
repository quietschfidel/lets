import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";
import {YamlConfiguration, YamlConfigurations} from "./interfaces";

export function readConfigurations(paths: string[]): YamlConfigurations {
  const configurations: YamlConfigurations = {};
  paths.forEach((currentPath) => {
    const workingDirectory: string = path.dirname(currentPath);
    configurations[workingDirectory] = readConfiguration(currentPath);
  });
  return configurations;
}

export function readConfiguration(fullConfigurationPath: string): YamlConfiguration {
  return yaml.safeLoad(fs.readFileSync(fullConfigurationPath, "utf8"));
}
