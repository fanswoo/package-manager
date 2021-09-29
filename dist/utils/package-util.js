"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class PackageUtil {
    static getPackageList(config) {
        const composerPackageList = composer_util_1.default.getPackageList(config);
        const npmPackageList = npm_util_1.default.getPackageList(config);
        return composerPackageList.concat(npmPackageList);
    }
    static getConfig(arg) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (arg === null || arg === void 0 ? void 0 : arg.configPath) {
                const configFile = `${process.cwd()}/${arg.configPath}`;
                try {
                    yield fs_1.default.accessSync(configFile, fs_1.default.constants.F_OK);
                }
                catch (error) {
                    throw new Error(`${configFile} not exists`);
                }
                // eslint-disable-next-line import/no-dynamic-require, global-require
                return require(configFile);
            }
            // eslint-disable-next-line import/no-dynamic-require, global-require
            return require(`${process.cwd()}/package-manager.config.js`);
        });
    }
}
exports.default = PackageUtil;
//# sourceMappingURL=package-util.js.map