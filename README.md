# `lets` just work

Tired of dipping into the Readme for each project to figure out how to run this thing?
Wouldn't it be cool to just use the same commands no matter what the underlying tech stack is?

`lets` is a command unifier for multi-stack projects, backed by simple yaml configuration files.

## Motivation
We've been working a lot in projects with many different git repositories, mono-repositories 
and microservices written in different technologies using different tools.
Remembering all the different commands that can be run in each folder for running tests, 
building or starting the application can become slightly challenging for people who've been 
there a while but for people joining the project, it's usually a real nightmare.

We therefore want to provide an easy way to provide the possible commands to run for each project
folder.

## Installation instructions
-> TODO: Will be added after first upload to npm repo

## Configuration examples
In the simplest form, just create a file called `.lets.yml` in your project's root directory.
This file contains a list of commands such as:

```yaml
commands:
  myFirstCommand:
    run: echo "Hello World!"
    description: Prints "Hello World!" on the command line
  mySecondCommand:
    run: echo "Hello World again!"
    description: Prints "Hello World again!" on the command line
```
Note that the description is optional but recommended so that people using `lets help` can easily 
tell what your commands are doing.

In a more real world example, you would hide your technology specific commands behind the same
`lets` command names. Let's imagine we have a project with 
- a Java backend which uses Gradle in `~/yourProject/backend`
- a React frontend which uses npm in `~/yourProject/frontend`

We could then create the following configuration files to be able to run the same commands
in all three folders:

`.lets.yml` in `~/yourProject/backend:
```yaml
commands:
    install:
      run: ./gradlew clean install
      description: Install backend dependencies
    test:
      run: ./gradlew clean test
      description: Run backend tests
    start:
      run: ./gradlew bootRun
      description: Start the backend
```

`.lets.yml` in `~/yourProject/frontend:
```yaml
commands:
    install:
      run: npm install
      description: Install frontend dependencies
    test:
      run: npm run test
      description: Run frontend tests
    start:
      run: npm run start
      description: Start the frontend
```

`.lets.yml` in `~/yourProject:
```yaml
commands:
    install:
      run: ./installBackendAndFrontendDependencies.sh
      description: Install project dependencies
    test:
      run: ./testAll.sh
      description: Run backend and frontend tests
    start:
      run: ./startAll.sh
      description: Start the backend and frontend
```

Depending on where you currently are in your project tree, running the same command, e.g. 
`lets start` will always start the application, either backend, fronted or both in combination.

### Running more than one instruction within a command
You can also run multiple instructions but adding line breaks in your configuration:
```yaml
commands:
  doubleHelloWorld:
    run: |
      echo "Hello World!"
      echo "Hello World again!"
    description: Greets the world twice"
```
Note that the instructions are run completely independently of each other, so the second
instruction will not evaluate that the first instruction ran successfully. It is therefore
not recommended to model complicated workflows here - (if necessary) this should be done
within the tools you're calling or within dedicated scripts .

### Passing parameters into your instructions
All arguments that are present on the command line are directly passed into the instructions
mentioned in the config file. Therefore, if you have a script `greeter.sh` with the content
```shell script
#!/bin/bash
echo "Hello $1!"
```
and a configurations such as 
```yaml
commands:
  greet:
    run: greeter.sh World
    description: Greets the person passed in as the first parameter
```
and call it via
```
lets greet World
```
you will get the following output:
```
Hello World!
```
Note that we usually don't recommend passing parameters as the goal of the tool is to
simplify the development workflow. If people now have to remember which parameters are
valid for which command, the helpfulness of the tool is quite questionable.

### Versioning the configuration
To make sure your configuration files adhere to the supported schema of everybody's version of `lets`, 
we recommend putting the expected application version at the top of each config file like this:
```yaml
minVersion: 0.0.1
commands: ...
```
This way, we can ensure that the layout of the configuration file can be run by a specific version
of `lets`. If somebody's version of `lets` is below the minimum version in one of the config files,
we show a message about how to update to the latest version.

## Development setup
We're always happy about people contributing to this project and this section aims to explain
how to do that.

The project currently uses pnpm as the package manager which can be installed via:
```
npm add -g pnpm
```
(Note that npm or yarn should also work for running all of the tasks but the 
`package-lock.json/yarn.lock` files that they generate are currently .gitignore'ed.)

To install all dependencies, simply run 
```
pnpm install
```

Available scripts for building and running the project can be found in the `scripts`-Section
of the [package.json](./package.json).

### Typical development workflow

- `git pull --rebase`
- `pnpm run build` includes linting and running tests to make sure everything you 
checked out is up and running.
- Make your additions/changes to code and tests
- `pnpm run build` to continuously run everything or just `pnpm run test`/`pnpm run lint` 
for tests or linting
- `pnpm run start -- <command>` to test running a command that has to be present in the
[.lets.yml](./.lets.yml)
- `pnpm link` to "install" lets as a command line tool with the current state. Make sure to
reload your terminal/open a new terminal for the changes to be effective.
- `pnpm unlink` to remove the link to the current executable (!Currently does not work, see 
[this bug report](https://github.com/pnpm/pnpm/issues/1584) for details).

## Contributors
Big thanks to [Christoph Stickel](https://github.com/mixer2) who had the original
idea for this tool!
