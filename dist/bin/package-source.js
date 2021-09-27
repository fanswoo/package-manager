#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../core/bootstrap");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = require("commander");
const cli_table3_1 = (0, tslib_1.__importDefault)(require("cli-table3"));
const inquirer_1 = (0, tslib_1.__importDefault)(require("inquirer"));
const package_source_1 = (0, tslib_1.__importDefault)(require("@/commands/package-source"));
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class CommandLine {
    constructor() {
        (0, clear_1.default)();
        console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo-cli')));
        this.commander = new commander_1.Command();
        this.commander
            .description('manage package')
            .option('-p, --platform <name>', 'platform')
            .option('-pkg, --package-name <name>', 'package')
            .option('-s, --source <source type>', 'source')
            .parse();
        this.options = this.commander.opts();
    }
    run() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.options.platform &&
                this.options.packageName &&
                this.options.source) {
                this.callPackageSource();
            }
            this.commander.outputHelp();
            console.log('\n 目前的套件來源位置：');
            const packageList = package_util_1.default.getPackageList();
            const table = new cli_table3_1.default({
                head: ['platform', 'package name', 'source type'],
                // colWidths: [100, 200],
            });
            packageList.forEach((item) => {
                table.push(item);
            });
            console.log(table.toString());
            console.log('\n');
            let answer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'platform',
                    message: '請輸入需要變更套件來源的套件管理平台名稱：',
                    choices: ['composer', 'npm'],
                },
            ]);
            this.options.platform = answer.platform;
            const config = package_util_1.default.getConfig();
            const packageNames = [];
            config.platforms
                .find((item) => this.options.platform === item.name)
                .packages.forEach((item) => {
                packageNames.push(item.name);
            });
            answer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'packageName',
                    message: `請輸入 ${this.options.platform} 需要變更套件來源的套件名稱：`,
                    choices: packageNames,
                },
            ]);
            this.options.packageName = answer.packageName;
            const repositorieSources = config.platforms
                .find((item) => this.options.platform === item.name)
                .packages.find((item) => this.options.packageName === item.name).sources;
            let currentPackageType = '';
            const sourceChoices = [];
            switch (this.options.platform) {
                case 'composer': {
                    currentPackageType = composer_util_1.default.getPackageType(this.options.packageName);
                    repositorieSources
                        .filter((item) => item.source !== currentPackageType)
                        .forEach((item) => {
                        sourceChoices.push(item.source);
                    });
                    break;
                }
                case 'npm': {
                    currentPackageType = npm_util_1.default.getPackageType(this.options.packageName);
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
                answer = yield inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'source',
                        message: '請輸入應改為哪一種套件來源：',
                        choices: sourceChoices,
                    },
                ]);
                this.options.source = answer.source;
            }
            else {
                answer = yield inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'source',
                        message: `是否將套件來源改為：${currentPackageType}`,
                        default: false,
                    },
                ]);
                if (answer.source) {
                    this.options.source = currentPackageType;
                }
                else {
                    console.log('%c cancel this command.', 'color: yellow');
                    process.exit();
                }
            }
            console.log(this.options);
            process.exit();
            this.callPackageSource();
        });
    }
    callPackageSource() {
        const packageSource = new package_source_1.default(this.options.platform, this.options.packageName, this.options.source);
        if (packageSource.isPackageTypeEqual()) {
            console.log("you can't change package to the same type.");
            process.exit();
        }
        packageSource.changeType();
        console.log(`成功將 ${this.options.platform} 套件管理平台內的 ${this.options.packageName} 套件來源變更為 "${this.options.source}"`);
    }
}
const commandLine = new CommandLine();
commandLine.run();
//# sourceMappingURL=package-source.js.map