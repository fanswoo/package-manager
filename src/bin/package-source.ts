#!/usr/bin/env node

import '../core/bootstrap';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { Command } from 'commander';
import CliTable3 from 'cli-table3';
import inquirer from 'inquirer';
import PackageSource from '@/commands/package-source';
import PackageUtil from '@/utils/package-util';
import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';

class CommandLine {
  protected options: {
    platform: string;
    packageName: string;
    source: string;
  };

  protected commander: any;

  constructor() {
    clear();
    console.log(chalk.red(figlet.textSync('fanswoo')));

    this.commander = new Command();
    this.commander
      .description('manage package')
      .option('-p, --platform <name>', 'platform')
      .option('-pkg, --package-name <name>', 'package')
      .option('-s, --source <source type>', 'source')
      .parse();

    this.options = this.commander.opts();
  }

  static showTable() {
    console.log('\n Package list:');

    const packageList = PackageUtil.getPackageList();

    const table = new CliTable3({
      head: ['platform', 'package name', 'source'],
      colWidths: [10, 20, 11],
    });

    packageList.forEach((item) => {
      table.push(item);
    });

    console.log(table.toString());
    console.log('\n');
  }

  async run() {
    if (
      this.options.platform &&
      this.options.packageName &&
      this.options.source
    ) {
      this.callPackageSource();
    }

    this.commander.outputHelp();

    CommandLine.showTable();

    let answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'platform',
        message: 'Please enter the name of the package platform:',
        choices: ['composer', 'npm'],
      },
    ]);
    this.options.platform = answer.platform;

    const config = PackageUtil.getConfig();
    const packageNames: any[] = [];
    config.platforms
      .find((item) => this.options.platform === item.name)!
      .packages.forEach((item) => {
        packageNames.push(item.name);
      });

    answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageName',
        message: `Please enter the package name of ${this.options.platform}:`,
        choices: packageNames,
      },
    ]);
    this.options.packageName = answer.packageName;

    const repositorieSources = config.platforms
      .find((item) => this.options.platform === item.name)!
      .packages.find(
        (item) => this.options.packageName === item.name,
      )!.sources;

    let currentPackageSource = '';
    const sourceChoices: string[] = [];
    switch (this.options.platform) {
      case 'composer': {
        currentPackageSource = ComposerUtil.getPackageType(
          this.options.packageName,
        );

        repositorieSources
          .filter((item) => item.source !== currentPackageSource)
          .forEach((item) => {
            sourceChoices.push(item.source);
          });

        break;
      }
      case 'npm': {
        currentPackageSource = NpmUtil.getPackageType(
          this.options.packageName,
        );

        repositorieSources
          .filter((item) => item.source !== currentPackageSource)
          .forEach((item) => {
            sourceChoices.push(item.source);
          });

        break;
      }
      default: {
        throw new Error('Please enter correct package name');
      }
    }

    if (sourceChoices.length > 1) {
      answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'source',
          message: `Please enter the source type of ${this.options.platform} ${this.options.packageName}:`,
          choices: sourceChoices,
        },
      ]);
      this.options.source = answer.source;
    } else {
      let eitherPackageSource;

      sourceChoices.forEach((item) => {
        if (item !== currentPackageSource) {
          eitherPackageSource = item;
        }
      });

      if (!eitherPackageSource) {
        throw new Error('Missing parameter "--source"');
      }

      answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'source',
          message: `Are you sure change ${this.options.platform} ${this.options.packageName} source type to "${eitherPackageSource}"`,
          default: false,
        },
      ]);

      if (answer.source) {
        this.options.source = eitherPackageSource;
      } else {
        console.log('%c You canceled the command.', 'color: yellow;');
        process.exit();
      }
    }

    this.callPackageSource();
  }

  callPackageSource() {
    const packageSource = new PackageSource(
      this.options.platform,
      this.options.packageName,
      this.options.source,
    );

    if (packageSource.isPackageTypeEqual()) {
      console.log(
        "%c You can't change package to the same source type.",
        'color: red;',
      );
      process.exit();
    }

    packageSource.changeType();

    console.log(
      `%c You have changed ${this.options.platform} ${this.options.packageName} source type to "${this.options.source}"`,
      'color: green;',
    );
  }
}

const commandLine = new CommandLine();
commandLine.run();
