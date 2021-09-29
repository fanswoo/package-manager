"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
const dependence_clone_1 = (0, tslib_1.__importDefault)(require("@/commands/dependence-clone"));
const dependence_remove_1 = (0, tslib_1.__importDefault)(require("@/commands/dependence-remove"));
class PackageManager {
    constructor(platform, packageName, source) {
        this.platform = platform;
        this.packageName = packageName;
        this.source = source;
        this.dev = false;
        if (!['composer', 'npm'].includes(platform)) {
            throw new Error('This command only supports composer and npm.');
        }
        this.platform = platform;
        this.packageName = packageName;
        this.source = source;
        const { platforms } = package_util_1.default.getConfig();
        const packageRepository = platforms
            .find((referPlatform) => this.platform === referPlatform.name)
            .packages.find((referPackage) => this.packageName === referPackage.name);
        if (packageRepository.dev) {
            this.dev = true;
        }
        this.packageSource = packageRepository.sources.find((referSource) => {
            const sourceName = this.source;
            return sourceName === referSource.source;
        });
    }
    isPackageTypeEqual() {
        switch (this.platform) {
            case 'composer':
                if (composer_util_1.default.getPackageType(this.packageName) ===
                    this.source) {
                    return true;
                }
                break;
            case 'npm':
                if (npm_util_1.default.getPackageType(this.packageName) === this.source) {
                    return true;
                }
                break;
            default:
                throw new Error('This command only supports composer and npm.');
        }
        return false;
    }
    changeType() {
        switch (this.platform) {
            case 'composer':
                return this.changeTypeByComposer();
            case 'npm':
                return this.changeTypeByNpm();
            default:
                return false;
        }
    }
    changeTypeByNpm() {
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
        const { platforms } = package_util_1.default.getConfig();
        const { dependenceDistDirectory, dependenceNamespace } = platforms.find((item) => item.name === 'npm');
        const newDependencePackageName = this.packageName
            .replace(/@/g, '')
            .replace(/\//g, '-');
        return {
            dependenceDistDirectory,
            dependenceNamespace,
            newDependencePackageName,
        };
    }
    changeTypeByComposer() {
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
    }
}
exports.default = PackageManager;
//# sourceMappingURL=package-source.js.map