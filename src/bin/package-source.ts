#!/usr/bin/env node

import 'module-alias/register';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import commander from 'commander';
import cliTable from 'cli-table3';
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
cliTable.table(
  ['platform', 'package name', 'source type'],
  packageList,
);

let { platform, packageName, source } = options;

platform = commander.choice(
  '請輸入需要變更套件來源的套件管理平台名稱：',
  ['composer', 'npm'],
  0,
);

const config = PackageUtil.getConfig();
const repositorieNames = Object.keys(
  config.packages.options.platform,
);

packageName = commander.choice(
  '請輸入 {platform} 需要變更套件來源的套件名稱：',
  repositorieNames,
  0,
);

const repositorieSourceTypes = Object.keys(
  config.packages[platform][packageName].source,
);

switch (platform) {
  case 'composer':
    const currentPackageType =
      ComposerUtil.getPackageType(packageName);

    commander.line(
      `準備替換 ${platform} 套件管理平台中的 ${packageName} 套件來源，目前的套件來源是 "${currentPackageType}"`,
    );

    if (
      ($key = array_search(
        currentPackageType,
        repositorieSourceTypes,
      )) !== false
    ) {
      unset(repositorieSourceTypes[$key]);
      repositorieSourceTypes = array_values(repositorieSourceTypes);
    }
    break;
  case 'npm':
    const currentPackageType = NpmUtil.getPackageType(packageName);

    commander.line(
      '<fg=magenta>準備替換 {platform} 套件管理平台中的 {packageName} 套件來源，目前的套件來源是 "{currentPackageType}"</>',
    );

    if (
      ($key = array_search(
        currentPackageType,
        repositorieSourceTypes,
      )) !== false
    ) {
      unset(repositorieSourceTypes[$key]);
      repositorieSourceTypes = array_values(repositorieSourceTypes);
    }
    break;
  default:
    break;
}

source = commander.choice(
  `請輸入 ${platform} 套件管理平台中的 ${packageName} 套件應改為哪一種套件來源：`,
  repositorieSourceTypes,
  0,
);

const repositoryTransferor = new PackageSource(
  platform,
  packageName,
  source,
);

if (repositoryTransferor.isPackageTypeEqual()) {
  commander.error("you can't change package to the same type.");
  process.exit();
}

repositoryTransferor.changeType();

commander.info(
  '成功將 {platform} 套件管理平台內的 {package} 套件來源變更為 "{source}"',
);
