#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const process_argv_1 = (0, tslib_1.__importDefault)(require("process.argv"));
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/commands/dependence-clone"));
const processArgv = (0, process_argv_1.default)(process.argv.slice(2));
const config = processArgv({
    '--': 'dependence-clone',
});
const command = config['--'];
if (command === 'dependence-clone') {
    const dependenceCloneInstance = new dependence_clone_1.default();
    dependenceCloneInstance.run();
}
else {
    console.warn('you have to provider command name');
}
