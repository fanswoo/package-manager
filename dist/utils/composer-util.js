"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class ComposerUtil {
    static getPackageList(config) {
        const packageExec = (0, child_process_1.execSync)('composer config repositories').toString();
        const allPackageNames = JSON.parse(packageExec);
        const packages = config.platforms.filter((item) => item.name === 'composer');
        const outputPackage = [];
        packages
            .find((item) => item.name === 'composer')
            .packages.forEach((packageSource) => {
            outputPackage.push([
                'composer',
                packageSource.name,
                ComposerUtil.repositoryToSourceType(allPackageNames[packageSource.name]),
            ]);
        });
        return outputPackage;
    }
    static repositoryToSourceType(packageSource) {
        if (packageSource.type === 'git') {
            if (packageSource.url.substr(0, 15) === 'git@github.com:') {
                return 'github';
            }
        }
        return packageSource.type;
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
        composer.packages.forEach((packageSource) => {
            if (packageSource.dist &&
                packageSource.dist.type &&
                packageSource.dist.type === 'path') {
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
}
exports.default = ComposerUtil;
//# sourceMappingURL=composer-util.js.map