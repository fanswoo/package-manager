#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../core/bootstrap");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = require("commander");
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const npm_package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/npm-package-source"));
const composer_package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/composer-package-source"));
const package_source_asker_1 = (0, tslib_1.__importDefault)(require("@/package-source/package-source-asker"));
class CommandLine {
    constructor() {
        (0, clear_1.default)();
        console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo')));
        this.commander = new commander_1.Command();
        this.commander
            .description('manage package')
            .option('-p, --platform <name>', 'input platform name')
            .option('-pkg, --package-name <name>', 'input package name')
            .option('-s, --source <source type>', 'input source type')
            .option('-c, --config-path <config path>', 'input config path')
            .parse();
        this.options = this.commander.opts();
        this.config = package_util_1.default.getConfig({
            configPath: this.options.configPath,
        });
    }
    run() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (this.options.platform &&
                this.options.packageName &&
                this.options.source) {
                this.changePackageSource();
                return true;
            }
            this.commander.outputHelp();
            const packageSourceAsker = new package_source_asker_1.default(this.config);
            yield packageSourceAsker.ask();
            const options = packageSourceAsker.getOptions();
            this.options.platform = options.platform;
            this.options.packageName = options.packageName;
            this.options.source = options.source;
            this.changePackageSource();
            return true;
        });
    }
    changePackageSource() {
        if (!['composer', 'npm'].includes(this.options.platform)) {
            throw new Error('This command only supports composer and npm.');
        }
        let packageSource;
        switch (this.options.platform) {
            case 'npm': {
                packageSource = new npm_package_source_1.default(this.config, this.options.packageName, this.options.source);
                break;
            }
            case 'composer': {
                packageSource = new composer_package_source_1.default(this.config, this.options.packageName, this.options.source);
                break;
            }
            default:
                throw new Error('Error!');
        }
        if (packageSource.isPackageTypeEqual()) {
            console.log("%c You can't change package to the same source type.", 'color: red;');
            process.exit();
        }
        packageSource.changeType();
        console.log(`%c You have changed ${this.options.platform} ${this.options.packageName} source type to "${this.options.source}"`, 'color: green;');
    }
}
const commandLine = new CommandLine();
commandLine.run();
//# sourceMappingURL=package-source.js.map