# pcs - project cheat sheet

## ;tldr
pcs is a cheat sheet tool and task runner for the command line that allows running commands defined in simple yaml files within a hierarchical project structure.

## Motivation
We've been working a lot in projects with many different git repositories, mono-repositories and microservices written in different technologies using different tools.
Remembering all the different commands that can be run in each folder for running tests, building or starting the application can become slightly challenging for people who've been there a while but for people joining the project, it's usually a real nightmare.
We therefore want to provide an easy way to provide the possible commands to run within a directory structure.

## Development setup
The project currently uses pnpm as the package manager which can be installed via `npm add -g pnpm`.
To get all dependencies, then simply run `pnpm install`.
Available scripts for building and running the project are:
- `pnpm run build`
- `pnpm run test`
- `pnpm run run`
