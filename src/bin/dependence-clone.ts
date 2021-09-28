#!/usr/bin/env node

import '../core/bootstrap';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { Command } from 'commander';
import DependenceClone from '@/commands/dependence-clone';

class CommandLine {
  protected options: { src: string; dist: string; name: string };

  protected commander: any;

  constructor() {
    this.commander = new Command();
    this.commander
      .description('create dependence package')
      .requiredOption('-s, --src <source path>', 'input source path')
      .requiredOption(
        '-d, --dist <distination path>',
        'input distination path',
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
    console.log(chalk.red(figlet.textSync('fanswoo')));

    if (this.options.src && this.options.dist && this.options.name) {
      const dependenceClone = new DependenceClone({
        src: this.options.src,
        dist: this.options.dist,
        name: this.options.name,
      });
      dependenceClone.run();
    } else {
      this.commander.outputHelp();
    }
  }
}

const commandLine = new CommandLine();
commandLine.run();
