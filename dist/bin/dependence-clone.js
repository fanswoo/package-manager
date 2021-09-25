#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const figlet_1 = (0, tslib_1.__importDefault)(require("figlet"));
const commander_1 = (0, tslib_1.__importDefault)(require("commander"));
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/commands/dependence-clone"));
(0, clear_1.default)();
console.log(chalk_1.default.red(figlet_1.default.textSync('fanswoo-cli')));
commander_1.default
    .version('1.0.0')
    .description('manage package')
    .requiredOption('-s, --src <source path>', 'enter source path', '../framework-core-front')
    .requiredOption('-d, --dist <distination path>', 'enter distination path', 'test')
    .requiredOption('-n, --name <package name>', 'enter package name', 'name')
    .parse(process.argv);
const options = commander_1.default.opts();
if (options.src && options.dist && options.name) {
    const dependenceCloneInstance = new dependence_clone_1.default({
        src: options.src,
        dist: options.dist,
        name: options.name,
    });
    dependenceCloneInstance.run();
}
else {
    commander_1.default.outputHelp();
}
