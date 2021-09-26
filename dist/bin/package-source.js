#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = (0, tslib_1.__importDefault)(require("commander"));
const cli_table3_1 = (0, tslib_1.__importDefault)(require("cli-table3"));
const package_source_1 = (0, tslib_1.__importDefault)(require("@/commands/package-source"));
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
(0, clear_1.default)();
console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo-cli')));
commander_1.default
    .version('1.0.0')
    .description('manage package')
    .requiredOption('-p, --platform <name>', 'platform')
    .requiredOption('-pkg, --package-name <name>', 'package')
    .requiredOption('-s, --source <source type>', 'source')
    .parse(process.argv);
const options = commander_1.default.opts();
if (!options.platform || !options.package || !options.source) {
    commander_1.default.outputHelp();
    process.exit();
}
console.log('目前的套件來源位置：');
const packageList = package_util_1.default.getPackageList();
cli_table3_1.default.head(['platform', 'package name', 'source type'], packageList);
cli_table3_1.default.push(packageList);
console.log(cli_table3_1.default.toString());
let { platform, packageName, source } = options;
platform = commander_1.default.choice('請輸入需要變更套件來源的套件管理平台名稱：', ['composer', 'npm'], 0);
const config = package_util_1.default.getConfig();
const repositoriePlatforms = Object.keys(config.platforms);
packageName = commander_1.default.choice(`請輸入 ${platform} 需要變更套件來源的套件名稱：`, repositoriePlatforms, 0);
let repositorieSources = config.platforms
    .find((item) => platform === item.name)
    .packages.find((item) => packageName === item.name).sources;
switch (platform) {
    case 'composer': {
        const currentPackageType = composer_util_1.default.getPackageType(packageName);
        console.log(`準備替換 ${platform} 套件管理平台中的 ${packageName} 套件來源，目前的套件來源是 "${currentPackageType}"`);
        repositorieSources = repositorieSources.filter((item) => item.source !== currentPackageType);
        break;
    }
    case 'npm': {
        const currentPackageType = npm_util_1.default.getPackageType(packageName);
        commander_1.default.line(`準備替換 ${platform} 套件管理平台中的 ${packageName} 套件來源，目前的套件來源是 "${currentPackageType}"`);
        repositorieSources = repositorieSources.filter((item) => item.source !== currentPackageType);
        break;
    }
    default:
        break;
}
source = commander_1.default.choice(`請輸入 ${platform} 套件管理平台中的 ${packageName} 套件應改為哪一種套件來源：`, repositorieSources, 0);
const repositoryTransferor = new package_source_1.default(platform, packageName, source);
if (repositoryTransferor.isPackageTypeEqual()) {
    console.log("you can't change package to the same type.");
    process.exit();
}
repositoryTransferor.changeType();
console.log(`成功將 ${platform} 套件管理平台內的 ${packageName} 套件來源變更為 "${source}"`);
