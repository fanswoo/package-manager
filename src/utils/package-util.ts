import fs from 'fs';
import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';
import { IPackageConfig } from '@/package-source/contracts/package';

export default class PackageUtil {
  static getPackageList(config: IPackageConfig) {
    const composerPackageList = ComposerUtil.getPackageList(config);
    const npmPackageList = NpmUtil.getPackageList(config);

    return composerPackageList.concat(npmPackageList);
  }

  static async getConfig(arg: {
    configPath: string;
  }): Promise<IPackageConfig> {
    if (arg?.configPath) {
      const configFile = `${process.cwd()}/${arg.configPath}`;

      try {
        await fs.accessSync(configFile, fs.constants.F_OK);
      } catch (error) {
        throw new Error(`${configFile} not exists`);
      }

      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(configFile);
    }

    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(`${process.cwd()}/package-manager.config.js`);
  }
}
