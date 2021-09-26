#!/usr/bin/env node

import 'module-alias/register';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import commander from 'commander';
import CliTable3 from 'cli-table3';
import PackageSource from '@/commands/package-source';
import PackageUtil from '@/utils/package-util';
import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';

clear();
console.log(chalk.red(figlet.textSync('fanswoo-cli')));

commander
  .version('1.0.0')
  .description('manage package')
  .requiredOption('-p, --platform <name>', 'platform')
  .requiredOption('-pkg, --package-name <name>', 'package')
  .requiredOption('-s, --source <source type>', 'source')
  .parse(process.argv);

const options = commander.opts();

if (!options.platform || !options.package || !options.source) {
  commander.outputHelp();
  process.exit();
}

console.log('目前的套件來源位置：');

const packageList = PackageUtil.getPackageList();
CliTable3.head(
  ['platform', 'package name', 'source type'],
  packageList,
);
CliTable3.push(packageList);
console.log(CliTable3.toString());

let { platform, packageName, source } = options;

platform = commander.choice(
  '請輸入需要變更套件來源的套件管理平台名稱：',
  ['composer', 'npm'],
  0,
);

const config = PackageUtil.getConfig();
const repositoriePlatforms = Object.keys(config.platforms);

packageName = commander.choice(
  `請輸入 ${platform} 需要變更套件來源的套件名稱：`,
  repositoriePlatforms,
  0,
);

let repositorieSources = config.platforms
  .find((item) => platform === item.name)!
  .packages.find((item) => packageName === item.name)!.sources;

switch (platform) {
  case 'composer': {
    const currentPackageType =
      ComposerUtil.getPackageType(packageName);

    console.log(
      `準備替換 ${platform} 套件管理平台中的 ${packageName} 套件來源，目前的套件來源是 "${currentPackageType}"`,
    );

    repositorieSources = repositorieSources.filter(
      (item) => item.source !== currentPackageType,
    );
    break;
  }
  case 'npm': {
    const currentPackageType = NpmUtil.getPackageType(packageName);

    commander.line(
      `準備替換 ${platform} 套件管理平台中的 ${packageName} 套件來源，目前的套件來源是 "${currentPackageType}"`,
    );

    repositorieSources = repositorieSources.filter(
      (item) => item.source !== currentPackageType,
    );

    break;
  }
  default:
    break;
}

source = commander.choice(
  `請輸入 ${platform} 套件管理平台中的 ${packageName} 套件應改為哪一種套件來源：`,
  repositorieSources,
  0,
);

const repositoryTransferor = new PackageSource(
  platform,
  packageName,
  source,
);

if (repositoryTransferor.isPackageTypeEqual()) {
  console.log("you can't change package to the same type.");
  process.exit();
}

repositoryTransferor.changeType();

console.log(
  `成功將 ${platform} 套件管理平台內的 ${packageName} 套件來源變更為 "${source}"`,
);
