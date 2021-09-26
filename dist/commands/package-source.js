"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const package_util_1 = (0, tslib_1.__importDefault)(require("@/utils/package-util"));
const composer_util_1 = (0, tslib_1.__importDefault)(require("@/utils/composer-util"));
const npm_util_1 = (0, tslib_1.__importDefault)(require("@/utils/npm-util"));
class PackageManager {
    constructor(platform, packageName, source) {
        this.platform = platform;
        this.packageName = packageName;
        this.source = source;
        this.dev = false;
        if (!['composer', 'npm'].includes(platform)) {
            throw new Error('本功能僅支持 compose 和 npm 套件管理平台');
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
                throw new Error('本功能僅支持 compose 和 npm 套件管理平台');
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
                (0, child_process_1.execSync)('npm install {this.packageName} {url}');
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
                this.packageSource = this.packageSource;
                const url = `file:${this.packageSource.path}`;
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
    }
    changeTypeByComposer() {
        (0, child_process_1.execSync)('composer remove {this.packageName}');
        switch (this.source) {
            case 'github': {
                this.packageSource = this.packageSource;
                const url = `git@github.com:${this.packageSource.name}.git`;
                (0, child_process_1.execSync)(`composer config repositories.${this.packageName} git ${url}`);
                const version = `dev-${this.packageSource.branch}`;
                (0, child_process_1.execSync)(`composer require ${this.packageName}:${version}`);
                break;
            }
            case 'path': {
                this.packageSource = this.packageSource;
                const url = this.packageSource.path;
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
