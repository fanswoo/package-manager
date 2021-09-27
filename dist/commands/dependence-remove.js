"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const child_process_1 = require("child_process");
class DependenceRemove {
    constructor(arg) {
        this.name = arg.name;
        this.dist = arg.dist;
    }
    run() {
        this.uninstallDependencePackage();
        this.removeDependencePackage();
        console.log('execution succeed');
    }
    removeDependencePackage() {
        fs_1.default.rmdirSync(`${process.cwd()}/${this.dist}`, {
            recursive: true,
        });
    }
    uninstallDependencePackage() {
        const output = (0, child_process_1.execSync)(`npm uninstall ${this.name}`).toString();
        console.log(output);
    }
}
exports.default = DependenceRemove;
