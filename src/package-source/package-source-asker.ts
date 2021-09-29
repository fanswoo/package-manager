import inquirer from 'inquirer';
import CliTable3 from 'cli-table3';
import PackageUtil from '@/utils/package-util';
import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';
import {
  IPackageConfig,
  IPackagistSource,
  IGithubSource,
  IPathSource,
} from '@/package-source/contracts/package';

export default class PackageSourceAsker {
  protected options: {
    platform: string;
    packageName: string;
    source: string;
  } = {
    platform: '',
    packageName: '',
    source: '',
  };

  constructor(protected config: IPackageConfig) {
    this.config = config;
  }

  async ask() {
    this.showTable();
    await this.askPlatform();
    await this.askPackageName();
    await this.askSource();
  }

  showTable() {
    console.log('\n Package list:');

    const packageList = PackageUtil.getPackageList(this.config);

    const table = new CliTable3({
      head: ['platform', 'package name', 'source'],
      colWidths: [10, 20, 11],
    });

    packageList.forEach((item) => {
      table.push(item);
    });

    console.log(table.toString());
  }

  getOptions() {
    return this.options;
  }

  async askPlatform() {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'platform',
        message: 'Please enter the name of the package platform:',
        choices: ['composer', 'npm'],
      },
    ]);
    this.options.platform = answer.platform;
  }

  async askPackageName() {
    const packageNames: any[] = [];
    this.config.platforms
      .find((item) => this.options.platform === item.name)!
      .packages.forEach((item) => {
        packageNames.push(item.name);
      });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageName',
        message: `Please enter the package name of ${this.options.platform}:`,
        choices: packageNames,
      },
    ]);
    this.options.packageName = answer.packageName;
  }

  async askSource() {
    const repositorieSources = this.config.platforms
      .find((item) => this.options.platform === item.name)!
      .packages.find(
        (item) => this.options.packageName === item.name,
      )!.sources;

    const { sourceChoices, currentPackageSource } =
      this.getPackageSourceAndSourceChoices(repositorieSources);

    if (sourceChoices.length > 1) {
      const answer = await inquirer.prompt([
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

      const answer = await inquirer.prompt([
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
  }

  getPackageSourceAndSourceChoices(
    repositorieSources: (
      | IPackagistSource
      | IPathSource
      | IGithubSource
    )[],
  ) {
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

    return {
      currentPackageSource,
      sourceChoices,
    };
  }
}
