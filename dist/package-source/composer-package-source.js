"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/contracts/package-source"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
class ComposerPackageSource extends package_source_1.default {
    constructor() {
        super(...arguments);
        this.platform = 'composer';
    }
    isPackageTypeEqual() {
        if (composer_util_1.default.getPackageType(this.packageName) === this.source) {
            return true;
        }
        return false;
    }
    changeType() {
        try {
            (0, child_process_1.execSync)(`composer remove ${this.packageName}`);
        }
        catch (error) {
            let errorMessage = 'error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.log(errorMessage);
        }
        switch (this.source) {
            case 'github': {
                const packageSource = this.packageSource;
                const url = `git@github.com:${packageSource.name}.git`;
                (0, child_process_1.execSync)(`composer config repositories.${this.packageName} git ${url}`);
                const version = `dev-${packageSource.branch}`;
                (0, child_process_1.execSync)(`composer require ${this.packageName}:${version}`);
                break;
            }
            case 'path': {
                const packageSource = this.packageSource;
                const url = packageSource.path;
                (0, child_process_1.execSync)(`composer config repositories.${this.packageName} path ${url}`);
                (0, child_process_1.execSync)(`composer require ${this.packageName}`);
                break;
            }
            default:
                break;
        }
        (0, child_process_1.execSync)('php ff framework:published');
        return true;
    }
}
exports.default = ComposerPackageSource;
//# sourceMappingURL=composer-package-source.js.map