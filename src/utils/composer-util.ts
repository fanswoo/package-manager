import { execSync } from 'child_process';
import PackageUtil from '@/utils/package-util';
import {
  IPackageRepository,
  IComposerPackageLockName,
} from '@/commands/contracts/package';

export default class ComposerUtil {
  static getPackageList() {
    const packageExec = execSync(
      'composer config repositories',
    ).toString();

    const allPackageNames = JSON.parse(packageExec);

    const packageNames = PackageUtil.getConfig().platforms.filter(
      (item) => item.name === 'composer',
    );

    const outputPackage = [];
    packageNames.forEach((packageRepository) => {
      outputPackage.push(
        ComposerUtil.repositoryToSourceType(
          allPackageNames[packageRepository.name],
        ),
      );
    });

    return JSON.parse(packageExec);
  }

  static repositoryToSourceType(
    packageRepository: IComposerPackageLockName,
  ) {
    if (
      packageRepository.type === 'git' &&
      packageRepository.url.substr(0, 15) === 'git@github.com:'
    ) {
      return 'github';
    }

    return packageRepository.type;
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
      (packageRepository: IComposerPackageLockName) => {
        if (
          packageRepository.dist &&
          packageRepository.dist.type &&
          packageRepository.dist.type === 'path'
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
