#!/usr/bin/env node

import '../core/bootstrap';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { Command } from 'commander';
import DependenceRemove from '@/commands/dependence-remove';

class CommandLine {
  protected options: { name: string; dist: string };

  protected commander: any;

  constructor() {
    this.commander = new Command();
    this.commander
      .description('remove dependence package')
      .requiredOption(
        '-d, --dist <distination name>',
        'input distination name',
      )
      .requiredOption(
        '-n, --name <package name>',
        'input package name',
      )
      .parse();

    this.options = this.commander.opts();
  }

  run() {
    clear();
    console.log(chalk.red(figlet.textSync('fanswoo-cli')));

    if (this.options.name && this.options.dist) {
      const dependenceRemove = new DependenceRemove({
        dist: this.options.dist,
        name: this.options.name,
      });
      dependenceRemove.run();
    } else {
      this.commander.outputHelp();
    }
  }
}

const commandLine = new CommandLine();
commandLine.run();
