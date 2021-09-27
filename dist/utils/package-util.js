"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class PackageUtil {
    static getPackageList() {
        const composerPackageList = composer_util_1.default.getPackageList();
        const npmPackageList = npm_util_1.default.getPackageList();
        return composerPackageList.concat(npmPackageList);
    }
    static getConfig() {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const packageConfig = require(`${process.cwd()}/package-manager.config.js`);
        return packageConfig;
    }
}
exports.default = PackageUtil;
//# sourceMappingURL=package-util.js.map