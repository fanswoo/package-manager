#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../core/bootstrap");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = require("commander");
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/npm-dependence/dependence-clone"));
class CommandLine {
    constructor() {
        this.commander = new commander_1.Command();
        this.commander
            .description('create dependence package')
            .requiredOption('-s, --src <source path>', 'input source path')
            .requiredOption('-d, --dist <distination path>', 'input distination path')
            .requiredOption('-n, --name <package name>', 'input package name')
            .parse();
        this.options = this.commander.opts();
    }
    run() {
        (0, clear_1.default)();
        console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo')));
        if (this.options.src && this.options.dist && this.options.name) {
            const dependenceClone = new dependence_clone_1.default({
                src: this.options.src,
                dist: this.options.dist,
                name: this.options.name,
            });
            dependenceClone.run();
        }
        else {
            this.commander.outputHelp();
        }
    }
}
const commandLine = new CommandLine();
commandLine.run();
//# sourceMappingURL=dependence-clone.js.map