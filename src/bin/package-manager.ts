#!/usr/bin/env ts-node

import 'module-alias/register';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import commander from 'commander';
import DependenceClone from '@/commands/dependence-clone';

clear();
console.log(chalk.red(figlet.textSync('fanswoo-cli')));

commander
  .version('1.0.0')
  .description('manage package')
  .requiredOption(
    '-s, --src <source path>',
    'enter source path',
    '../framework-core-front',
  )
  .requiredOption(
    '-d, --dist <distination path>',
    'enter distination path',
    'test',
  )
  .requiredOption(
    '-n, --name <package name>',
    'enter package name',
    'name',
  )
  .parse(process.argv);

const options = commander.opts();

if (options.src && options.dist && options.name) {
  const dependenceCloneInstance = new DependenceClone({
    src: options.src,
    dist: options.dist,
    name: options.name,
  });
  dependenceCloneInstance.run();
} else {
  commander.outputHelp();
}
