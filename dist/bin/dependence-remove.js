#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../core/bootstrap");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = require("commander");
const dependence_remove_1 = (0, tslib_1.__importDefault)(require("@/commands/dependence-remove"));
class CommandLine {
    constructor() {
        this.commander = new commander_1.Command();
        this.commander
            .description('remove dependence package')
            .requiredOption('-d, --dist <distination name>', 'input distination name')
            .requiredOption('-n, --name <package name>', 'input package name')
            .parse();
        this.options = this.commander.opts();
    }
    run() {
        (0, clear_1.default)();
        console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo-cli')));
        if (this.options.name && this.options.dist) {
            const dependenceRemove = new dependence_remove_1.default({
                dist: this.options.dist,
                name: this.options.name,
            });
            dependenceRemove.run();
        }
        else {
            this.commander.outputHelp();
        }
    }
}
const commandLine = new CommandLine();
commandLine.run();
//# sourceMappingURL=dependence-remove.js.map