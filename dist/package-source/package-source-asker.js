"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inquirer_1 = (0, tslib_1.__importDefault)(require("inquirer"));
const colors_1 = (0, tslib_1.__importDefault)(require("colors"));
const cli_table3_1 = (0, tslib_1.__importDefault)(require("cli-table3"));
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class PackageSourceAsker {
    constructor(config) {
        this.config = config;
        this.options = {
            platform: '',
            packageName: '',
            source: '',
        };
        this.config = config;
    }
    ask() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            this.showTable();
            yield this.askPlatform();
            yield this.askPackageName();
            yield this.askSource();
        });
    }
    showTable() {
        console.log('\n Package list:');
        const packageList = package_util_1.default.getPackageList(this.config);
        const table = new cli_table3_1.default({
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
    askPlatform() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const answer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'platform',
                    message: 'Please enter the name of the package platform:',
                    choices: ['composer', 'npm'],
                },
            ]);
            this.options.platform = answer.platform;
        });
    }
    askPackageName() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const packageNames = [];
            this.config.platforms
                .find((item) => this.options.platform === item.name)
                .packages.forEach((item) => {
                packageNames.push(item.name);
            });
            const answer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'packageName',
                    message: `Please enter the package name of ${this.options.platform}:`,
                    choices: packageNames,
                },
            ]);
            this.options.packageName = answer.packageName;
        });
    }
    askSource() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const repositorieSources = this.config.platforms
                .find((item) => this.options.platform === item.name)
                .packages.find((item) => this.options.packageName === item.name).sources;
            const { sourceChoices, currentPackageSource } = this.getPackageSourceAndSourceChoices(repositorieSources);
            if (sourceChoices.length > 1) {
                const answer = yield inquirer_1.default.prompt([
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
                const answer = yield inquirer_1.default.prompt([
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
                    console.log(colors_1.default.yellow('You canceled the command.'));
                    process.exit();
                }
            }
        });
    }
    getPackageSourceAndSourceChoices(repositorieSources) {
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
        return {
            currentPackageSource,
            sourceChoices,
        };
    }
}
exports.default = PackageSourceAsker;
//# sourceMappingURL=package-source-asker.js.map