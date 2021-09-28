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
        console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo')));
        this.commander = new commander_1.Command();
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
        const packageList = package_util_1.default.getPackageList();
        const table = new cli_table3_1.default({
            head: ['platform', 'package name', 'source'],
            colWidths: [10, 20, 8],
        });
        packageList.forEach((item) => {
            table.push(item);
        });
        console.log(table.toString());
        console.log('\n');
    }
    run() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.options.platform &&
                this.options.packageName &&
                this.options.source) {
                this.callPackageSource();
            }
            this.commander.outputHelp();
            CommandLine.showTable();
            let answer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'platform',
                    message: 'Please enter the name of the package platform:',
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
                    message: `Please enter the package name of ${this.options.platform}:`,
                    choices: packageNames,
                },
            ]);
            this.options.packageName = answer.packageName;
            const repositorieSources = config.platforms
                .find((item) => this.options.platform === item.name)
                .packages.find((item) => this.options.packageName === item.name).sources;
            let currentPackageSource = '';
            const sourceChoices = [];
            switch (this.options.platform) {
                case 'composer': {
                    currentPackageSource = composer_util_1.default.getPackageType(this.options.packageName);
                    repositorieSources
                        .filter((item) => item.source !== currentPackageSource)
                        .forEach((item) => {
                        sourceChoices.push(item.source);
                    });
                    break;
                }
                case 'npm': {
                    currentPackageSource = npm_util_1.default.getPackageType(this.options.packageName);
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
                answer = yield inquirer_1.default.prompt([
                    {
                        type: 'list',
                        name: 'source',
                        message: `Please enter the source type of ${this.options.platform} ${this.options.packageName}:`,
                        choices: sourceChoices,
                    },
                ]);
                this.options.source = answer.source;
            }
            else {
                let eitherPackageSource;
                sourceChoices.forEach((item) => {
                    if (item !== currentPackageSource) {
                        eitherPackageSource = item;
                    }
                });
                if (!eitherPackageSource) {
                    throw new Error('Missing parameter "--source"');
                }
                answer = yield inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'source',
                        message: `Are you sure change ${this.options.platform} ${this.options.packageName} source type to "${eitherPackageSource}"`,
                        default: false,
                    },
                ]);
                if (answer.source) {
                    this.options.source = eitherPackageSource;
                }
                else {
                    console.log('%c You canceled the command.', 'color: yellow');
                    process.exit();
                }
            }
            this.callPackageSource();
        });
    }
    callPackageSource() {
        const packageSource = new package_source_1.default(this.options.platform, this.options.packageName, this.options.source);
        if (packageSource.isPackageTypeEqual()) {
            console.log("%c You can't change package to the same source type.", 'color: red');
            process.exit();
        }
        packageSource.changeType();
        console.log(`%c You have changed ${this.options.platform} ${this.options.packageName} source type to "${this.options.source}"`, 'color: green');
    }
}
const commandLine = new CommandLine();
commandLine.run();
//# sourceMappingURL=package-source.js.map