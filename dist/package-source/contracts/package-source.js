"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackageSource {
    constructor(config, packageName, source) {
        this.config = config;
        this.packageName = packageName;
        this.source = source;
        this.dev = false;
        this.config = config;
        this.packageName = packageName;
        this.source = source;
    }
    initPackageSource() {
        const packageRepository = this.config.platforms
            .find((item) => this.platform === item.name)
            .packages.find((item) => this.packageName === item.name);
        if (packageRepository.dev) {
            this.dev = true;
        }
        this.packageSource = packageRepository.sources.find((item) => {
            const sourceName = this.source;
            return sourceName === item.source;
        });
    }
}
exports.default = PackageSource;
//# sourceMappingURL=package-source.js.map