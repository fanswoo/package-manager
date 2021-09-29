"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/contracts/package-source"));
const npm_package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/npm-package-source"));
const composer_package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/composer-package-source"));
const dependence_remove_1 = (0, tslib_1.__importDefault)(require("@/npm-dependence/dependence-remove"));
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/npm-dependence/dependence-clone"));
exports.default = {
    PackageSource: package_source_1.default,
    NpmPackageSource: npm_package_source_1.default,
    ComposerPackageSource: composer_package_source_1.default,
    DependenceRemove: dependence_remove_1.default,
    DependenceClone: dependence_clone_1.default,
};
//# sourceMappingURL=main.js.map