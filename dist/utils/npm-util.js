"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
class NpmUtil {
    static getPackages() {
        const packageExec = (0, child_process_1.execSync)('npm ls --json').toString();
        return JSON.parse(packageExec);
    }
    static getPackageList() {
        const allPackages = NpmUtil.getPackages();
        const packages = package_util_1.default.getConfig().platforms.filter((item) => item.name === 'npm');
        const outputPackage = [];
        packages.forEach((packageRepository) => {
            outputPackage.push(NpmUtil.resolvedToSourceType(allPackages.dependencies[packageRepository.name].resolved));
        });
        return outputPackage;
    }
    static getPackageResolved(inputPackage) {
        const packages = NpmUtil.getPackages();
        return packages.dependencies[inputPackage].resolved;
    }
    static resolvedToSourceType(resolved) {
        if (resolved.substr(0, 24) === 'git+ssh://git@github.com') {
            return 'github';
        }
        if (resolved.substr(0, 26) === 'https://registry.npmjs.org') {
            return 'packagist';
        }
        if (resolved.substr(0, 5) === 'file:') {
            return 'path';
        }
        return '';
    }
    static getPackageType(inputPackage) {
        // const packages = PackageUtil.getConfig().update.packages;
        // let dev = false;
        // if (
        //   packages.npm[inputPackage].dev &&
        //   packages.npm[inputPackage].dev
        // ) {
        //   dev = true;
        // }
        const resolved = NpmUtil.getPackageResolved(inputPackage);
        return NpmUtil.resolvedToSourceType(resolved);
    }
    static hasPathTypePackages() {
        const packages = NpmUtil.getPackages();
        packages.dependencies.forEach((packageName) => {
            if (packageName.resolved &&
                packageName.resolved.substr(0, 5) === 'file:') {
                return true;
            }
            return false;
        });
        return false;
    }
}
exports.default = NpmUtil;
