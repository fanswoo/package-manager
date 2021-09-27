import { execSync } from 'child_process';
import PackageUtil from '@/utils/package-util';
import {
  IPackageRepository,
  IComposerPackageLockName,
  // IPackagistSource,
  // IPathSource,
  // IGithubSource,
} from '@/commands/contracts/package';

export default class ComposerUtil {
  static getPackageList() {
    const packageExec = execSync(
      'composer config repositories',
    ).toString();

    const allPackageNames = JSON.parse(packageExec);
    const packages = PackageUtil.getConfig().platforms.filter(
      (item) => item.name === 'composer',
    );

    const outputPackage: any[] = [];
    packages
      .find((item) => item.name === 'composer')!
      .packages.forEach((packageSource) => {
        outputPackage.push([
          'composer',
          packageSource.name,
          ComposerUtil.repositoryToSourceType(
            allPackageNames[packageSource.name],
          ),
        ]);
      });

    return outputPackage;
  }

  static repositoryToSourceType(
    packageSource: IComposerPackageLockName,
  ) {
    if (packageSource.type === 'git') {
      if (packageSource.url!.substr(0, 15) === 'git@github.com:') {
        return 'github';
      }
    }

    return packageSource.type;
  }

  static getPackageType(inputPackage: string): string {
    const packageName = execSync(
      `composer config repositories.${inputPackage}`,
    ).toString();
    const packageNames = JSON.parse(packageName);

    return ComposerUtil.repositoryToSourceType(packageNames);
  }

  static hasPathTypePackages(): boolean {
    const composer = JSON.parse(
      // eslint-disable-next-line import/no-dynamic-require, global-require
      require(`${process.cwd()}/composer.lock`),
    );

    composer.packages.forEach(
      (packageSource: IComposerPackageLockName) => {
        if (
          packageSource.dist &&
          packageSource.dist.type &&
          packageSource.dist.type === 'path'
        ) {
          return true;
        }
        return false;
      },
    );

    return false;
  }

  static isSetPackages(): boolean {
    const composer = JSON.parse(
      // eslint-disable-next-line import/no-dynamic-require, global-require
      require(`${process.cwd()}/composer.lock`),
    );

    if (!composer.packages) {
      return false;
    }

    return true;
  }

  static isValidate(): boolean {
    const result = execSync(
      'composer validate --no-check-all --strict',
    ).toString();

    if (result === './composer.json is valid') {
      return true;
    }

    return false;
  }

  static update(targetPackages: IPackageRepository[]) {
    if (targetPackages.length === 0) {
      execSync('composer update');
    } else {
      targetPackages.forEach(() => {
        execSync('composer update packageName');
      });
    }

    return true;
  }
}
