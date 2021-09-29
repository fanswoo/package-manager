#!/usr/bin/env node

import '../core/bootstrap';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { Command } from 'commander';
import PackageUtil from '@/utils/package-util';
import NpmPackageSource from '@/package-source/npm-package-source';
import ComposerPackageSource from '@/package-source/composer-package-source';
import PackageSourceAsker from '@/package-source/package-source-asker';
import { IPackageConfig } from '@/package-source/contracts/package';

class CommandLine {
  protected options: {
    platform: string;
    packageName: string;
    source: string;
    configPath: string;
  };

  protected commander: any;

  protected config: IPackageConfig;

  constructor() {
    clear();
    console.log(chalk.red(figlet.textSync('fanswoo')));

    this.commander = new Command();
    this.commander
      .description('manage package')
      .option('-p, --platform <name>', 'input platform name')
      .option('-pkg, --package-name <name>', 'input package name')
      .option('-s, --source <source type>', 'input source type')
      .option('-c, --config-path <config path>', 'input config path')
      .parse();

    this.options = this.commander.opts();

    this.config = PackageUtil.getConfig({
      configPath: this.options.configPath,
    });
  }

  async run(): Promise<boolean> {
    if (
      this.options.platform &&
      this.options.packageName &&
      this.options.source
    ) {
      this.changePackageSource();
      return true;
    }

    this.commander.outputHelp();

    const packageSourceAsker = new PackageSourceAsker(this.config);
    await packageSourceAsker.ask();

    const options = packageSourceAsker.getOptions();
    this.options.platform = options.platform;
    this.options.packageName = options.packageName;
    this.options.source = options.source;

    this.changePackageSource();
    return true;
  }

  changePackageSource() {
    if (!['composer', 'npm'].includes(this.options.platform)) {
      throw new Error('This command only supports composer and npm.');
    }

    let packageSource;
    switch (this.options.platform) {
      case 'npm': {
        packageSource = new NpmPackageSource(
          this.config,
          this.options.packageName,
          this.options.source,
        );
        break;
      }
      case 'composer': {
        packageSource = new ComposerPackageSource(
          this.config,
          this.options.packageName,
          this.options.source,
        );
        break;
      }
      default:
        throw new Error('Error!');
    }

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
