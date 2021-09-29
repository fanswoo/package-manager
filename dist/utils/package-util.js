"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class PackageUtil {
    static getPackageList(config) {
        const composerPackageList = composer_util_1.default.getPackageList(config);
        const npmPackageList = npm_util_1.default.getPackageList(config);
        return composerPackageList.concat(npmPackageList);
    }
    static getConfig(arg) {
        if (arg === null || arg === void 0 ? void 0 : arg.configPath) {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            return require(arg.configPath);
        }
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(`${process.cwd()}/package-manager.config.js`);
    }
}
exports.default = PackageUtil;
//# sourceMappingURL=package-util.js.map