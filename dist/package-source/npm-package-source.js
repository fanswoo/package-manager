"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_source_1 = (0, tslib_1.__importDefault)(require("@/package-source/contracts/package-source"));
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/npm-dependence/dependence-clone"));
const dependence_remove_1 = (0, tslib_1.__importDefault)(require("@/npm-dependence/dependence-remove"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class NpmPackageSource extends package_source_1.default {
    constructor() {
        super(...arguments);
        this.platform = 'npm';
    }
    isPackageTypeEqual() {
        if (npm_util_1.default.getPackageType(this.packageName) === this.source) {
            return true;
        }
        return false;
    }
    changeType() {
        this.initPackageSource();
        switch (this.source) {
            case 'github': {
                this.packageSource = this.packageSource;
                const url = `github:${this.packageSource.name}`;
                let branch = '';
                if (this.packageSource.branch) {
                    branch = `#${this.packageSource.branch}`;
                }
                if (this.dev) {
                    (0, child_process_1.execSync)(`npm install --save-dev ${this.packageName} ${url}${branch}`);
                    break;
                }
                (0, child_process_1.execSync)(`npm install ${this.packageName} ${url}`);
                break;
            }
            case 'packagist': {
                this.packageSource = this.packageSource;
                const { version } = this.packageSource;
                if (this.dev) {
                    (0, child_process_1.execSync)(`npm install --save-dev ${this.packageName} ${version}`);
                    break;
                }
                (0, child_process_1.execSync)(`npm install ${this.packageName} ${version}`);
                break;
            }
            case 'path': {
                const packageSource = this.packageSource;
                const url = `file:${packageSource.path}`;
                if (this.dev) {
                    (0, child_process_1.execSync)(`npm install --save-dev ${this.packageName} ${url}`);
                    break;
                }
                (0, child_process_1.execSync)(`npm install ${this.packageName} ${url}`);
                break;
            }
            default:
                break;
        }
        this.handleDependence();
        return true;
    }
    handleDependence() {
        const { dependenceDistDirectory, dependenceNamespace, newDependencePackageName, } = this.getDependenceData();
        if (this.source === 'path') {
            const packageSource = this.packageSource;
            const dependenceClone = new dependence_clone_1.default({
                src: packageSource.path,
                dist: `${dependenceDistDirectory}/${newDependencePackageName}`,
                name: `@${dependenceNamespace}/${newDependencePackageName}`,
            });
            dependenceClone.run();
        }
        else {
            const dependenceRemove = new dependence_remove_1.default({
                dist: `${dependenceDistDirectory}/${newDependencePackageName}`,
                name: `@${dependenceNamespace}/${newDependencePackageName}`,
            });
            dependenceRemove.run();
        }
    }
    getDependenceData() {
        const { dependenceDistDirectory, dependenceNamespace } = this.config.platforms.find((item) => item.name === 'npm');
        const newDependencePackageName = this.packageName
            .replace(/@/g, '')
            .replace(/\//g, '-');
        return {
            dependenceDistDirectory,
            dependenceNamespace,
            newDependencePackageName,
        };
    }
}
exports.default = NpmPackageSource;
//# sourceMappingURL=npm-package-source.js.map