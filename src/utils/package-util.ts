import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';
import { IPackageConfig } from '@/package-source/contracts/package';

export default class PackageUtil {
  static getPackageList(config: IPackageConfig) {
    const composerPackageList = ComposerUtil.getPackageList(config);
    const npmPackageList = NpmUtil.getPackageList(config);

    return composerPackageList.concat(npmPackageList);
  }

  static getConfig(arg: { configPath: string }): IPackageConfig {
    if (arg?.configPath) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(arg.configPath);
    }

    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(`${process.cwd()}/package-manager.config.js`);
  }
}
