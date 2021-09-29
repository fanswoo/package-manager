"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const colors_1 = (0, tslib_1.__importDefault)(require("colors"));
const child_process_1 = require("child_process");
class DependenceClone {
    constructor(arg) {
        this.src = arg.src;
        this.dist = arg.dist;
        this.name = arg.name;
    }
    run() {
        this.buildDependencePackage();
        this.installDependencePackage();
        console.log(colors_1.default.green('execution succeed'));
    }
    buildDependencePackage() {
        const srcDependencies = JSON.parse(fs_1.default
            .readFileSync(`${process.cwd()}/${this.src}/package.json`)
            .toString()).dependencies;
        const distPackage = {
            name: this.name,
            dependencies: srcDependencies,
        };
        if (!fs_1.default.existsSync(`${process.cwd()}/${this.dist}`)) {
            fs_1.default.mkdirSync(`${process.cwd()}/${this.dist}`, {
                recursive: true,
            });
        }
        fs_1.default.writeFileSync(`${process.cwd()}/${this.dist}/package.json`, JSON.stringify(distPackage, null, 2));
    }
    installDependencePackage() {
        (0, child_process_1.execSync)(`npm install --save-dev file:${this.dist}`).toString();
    }
}
exports.default = DependenceClone;
//# sourceMappingURL=dependence-clone.js.map