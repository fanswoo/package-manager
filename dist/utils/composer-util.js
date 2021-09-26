"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
class ComposerUtil {
    static getPackageList() {
        const packageExec = (0, child_process_1.execSync)('composer config repositories').toString();
        const allPackageNames = JSON.parse(packageExec);
        const packageNames = package_util_1.default.getConfig().platforms.filter((item) => item.name === 'composer');
        const outputPackage = [];
        packageNames.forEach((packageRepository) => {
            outputPackage.push(ComposerUtil.repositoryToSourceType(allPackageNames[packageRepository.name]));
        });
        return JSON.parse(packageExec);
    }
    static repositoryToSourceType(packageRepository) {
        if (packageRepository.type === 'git' &&
            packageRepository.url.substr(0, 15) === 'git@github.com:') {
            return 'github';
        }
        return packageRepository.type;
    }
    static getPackageType(inputPackage) {
        const packageName = (0, child_process_1.execSync)(`composer config repositories.${inputPackage}`).toString();
        const packageNames = JSON.parse(packageName);
        return ComposerUtil.repositoryToSourceType(packageNames);
    }
    static hasPathTypePackages() {
        const composer = JSON.parse(
        // eslint-disable-next-line import/no-dynamic-require, global-require
        require(`${process.cwd()}/composer.lock`));
        composer.packages.forEach((packageRepository) => {
            if (packageRepository.dist &&
                packageRepository.dist.type &&
                packageRepository.dist.type === 'path') {
                return true;
            }
            return false;
        });
        return false;
    }
    static isSetPackages() {
        const composer = JSON.parse(
        // eslint-disable-next-line import/no-dynamic-require, global-require
        require(`${process.cwd()}/composer.lock`));
        if (!composer.packages) {
            return false;
        }
        return true;
    }
    static isValidate() {
        const result = (0, child_process_1.execSync)('composer validate --no-check-all --strict').toString();
        if (result === './composer.json is valid') {
            return true;
        }
        return false;
    }
    static update(targetPackages) {
        if (targetPackages.length === 0) {
            (0, child_process_1.execSync)('composer update');
        }
        else {
            targetPackages.forEach(() => {
                (0, child_process_1.execSync)('composer update packageName');
            });
        }
        return true;
    }
}
exports.default = ComposerUtil;
