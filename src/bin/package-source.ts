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
    console.log(chalk.red(figlet.textSync('fanswoo-cli')));

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
    console.log('\n 目前的套件來源位置：');

    const packageList = PackageUtil.getPackageList();

    const table = new CliTable3({
      head: ['platform', 'package name', 'source type'],
      // colWidths: [100, 200],
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
        message: '請輸入需要變更套件來源的套件管理平台名稱：',
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
        message: `請輸入 ${this.options.platform} 需要變更套件來源的套件名稱：`,
        choices: packageNames,
      },
    ]);
    this.options.packageName = answer.packageName;

    const repositorieSources = config.platforms
      .find((item) => this.options.platform === item.name)!
      .packages.find(
        (item) => this.options.packageName === item.name,
      )!.sources;

    let currentPackageType = '';
    const sourceChoices: string[] = [];
    switch (this.options.platform) {
      case 'composer': {
        currentPackageType = ComposerUtil.getPackageType(
          this.options.packageName,
        );

        repositorieSources
          .filter((item) => item.source !== currentPackageType)
          .forEach((item) => {
            sourceChoices.push(item.source);
          });

        break;
      }
      case 'npm': {
        currentPackageType = NpmUtil.getPackageType(
          this.options.packageName,
        );

        repositorieSources
          .filter((item) => item.source !== currentPackageType)
          .forEach((item) => {
            sourceChoices.push(item.source);
          });

        break;
      }
      default: {
        throw new Error('必須選擇正確的套件');
      }
    }

    if (sourceChoices.length > 1) {
      answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'source',
          message: '請輸入應改為哪一種套件來源：',
          choices: sourceChoices,
        },
      ]);
      this.options.source = answer.source;
    } else {
      answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'source',
          message: `是否將套件來源改為：${currentPackageType}`,
          default: false,
        },
      ]);

      if (answer.source) {
        this.options.source = currentPackageType;
      } else {
        console.log('%c cancel this command.', 'color: yellow');
        process.exit();
      }
    }

    console.log(this.options);
    process.exit();

    this.callPackageSource();
  }

  callPackageSource() {
    const packageSource = new PackageSource(
      this.options.platform,
      this.options.packageName,
      this.options.source,
    );

    if (packageSource.isPackageTypeEqual()) {
      console.log("you can't change package to the same type.");
      process.exit();
    }

    packageSource.changeType();

    console.log(
      `成功將 ${this.options.platform} 套件管理平台內的 ${this.options.packageName} 套件來源變更為 "${this.options.source}"`,
    );
  }
}

const commandLine = new CommandLine();
commandLine.run();
