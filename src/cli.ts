#!/usr/bin/env node

import {printError} from "./consolePrinter";
import {run} from "./main";

const userInput = process.argv[2] || "help";

run(userInput).catch((error) => {
  printError(`Some unexpected error occurred.\n`, error);
});
