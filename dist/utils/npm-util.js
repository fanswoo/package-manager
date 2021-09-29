"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class NpmUtil {
    static getPackages() {
        const packageExec = (0, child_process_1.execSync)('npm ls --json').toString();
        return JSON.parse(packageExec);
    }
    static getPackageList(config) {
        const allPackages = NpmUtil.getPackages();
        const packages = config.platforms.filter((item) => item.name === 'npm');
        const outputPackage = [];
        packages
            .find((item) => item.name === 'npm')
            .packages.forEach((packageRepository) => {
            outputPackage.push([
                'npm',
                packageRepository.name,
                NpmUtil.resolvedToSourceType(allPackages.dependencies[packageRepository.name].resolved),
            ]);
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
//# sourceMappingURL=npm-util.js.map