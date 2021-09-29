import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';
import { IPackageConfig } from '@/package-source/contracts/package';

export default class PackageUtil {
  static getPackageList() {
    const composerPackageList = ComposerUtil.getPackageList();
    const npmPackageList = NpmUtil.getPackageList();

    return composerPackageList.concat(npmPackageList);
  }

  static getConfig(): IPackageConfig {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const packageConfig = require(`${process.cwd()}/package-manager.config.js`);

    return packageConfig;
  }
}
