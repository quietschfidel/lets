import * as fs from "fs";
import * as path from "path";

export function resolveWorkingDirectory(): string {
  return process.cwd();
}

export function resolveParents(sourcePath: string): string[] {
  let currentPath = (path.resolve(sourcePath, ".")); // to remove trailing slash if necessary
  const discoveredPaths = [currentPath];

  while (hasParent(currentPath)) {
    currentPath = getParent(currentPath);
    discoveredPaths.push(currentPath);
  }

  return discoveredPaths;
}

export function onlyDirectoriesContainingFile(filename: string, paths: string[]): string[] {
  return paths.map((pathWithoutConfigFilename) => {
    return path.join(pathWithoutConfigFilename, filename);
  }).filter((pathWithConfigFilename) => {
    return fs.existsSync(pathWithConfigFilename);
  });
}

function hasParent(somePath: string): boolean {
  return path.resolve(somePath, "..") !== somePath;
}

function getParent(somePath: string): string {
  return path.resolve(somePath, "..");
}
