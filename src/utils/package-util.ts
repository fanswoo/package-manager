import ComposerUtil from '@/utils/composer-util';
import { IPackageConfig } from '@/commands/contracts/package';

export default class PackageUtil {
  static getPackageList() {
    const composerPackageList = ComposerUtil.getPackageList();
    const npmPackageList = ComposerUtil.getPackageList();

    return composerPackageList.concat(npmPackageList);
  }

  static getConfig(): IPackageConfig {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const packageConfig = require(`${process.cwd()}/examples/package-manager.config.js`);

    return packageConfig;
  }
}
