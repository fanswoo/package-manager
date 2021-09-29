import { execSync } from 'child_process';
import PackageUtil from '@/utils/package-util';
import { INpmPackageLockName } from '@/package-source/contracts/package';

export default class NpmUtil {
  static getPackages() {
    const packageExec = execSync('npm ls --json').toString();

    return JSON.parse(packageExec);
  }

  static getPackageList() {
    const allPackages = NpmUtil.getPackages();

    const packages = PackageUtil.getConfig().platforms.filter(
      (item) => item.name === 'npm',
    );

    const outputPackage: any[] = [];
    packages
      .find((item) => item.name === 'npm')!
      .packages.forEach((packageRepository) => {
        outputPackage.push([
          'npm',
          packageRepository.name,
          NpmUtil.resolvedToSourceType(
            allPackages.dependencies[packageRepository.name].resolved,
          ),
        ]);
      });

    return outputPackage;
  }

  static getPackageResolved(inputPackage: string): string {
    const packages = NpmUtil.getPackages();

    return packages.dependencies[inputPackage].resolved;
  }

  static resolvedToSourceType(resolved: string): string {
    if (resolved.substr(0, 24) === 'git+ssh://git@github.com') {
      return 'github';
    }

    if (resolved.substr(0, 26) === 'https://registry.npmjs.org') {
      return 'packagist';
    }

    if (resolved.substr(0, 5) === 'file:') {
      return 'path';
    }

    return '';
  }

  static getPackageType(inputPackage: string): string {
    // const packages = PackageUtil.getConfig().update.packages;

    // let dev = false;
    // if (
    //   packages.npm[inputPackage].dev &&
    //   packages.npm[inputPackage].dev
    // ) {
    //   dev = true;
    // }

    const resolved = NpmUtil.getPackageResolved(inputPackage);

    return NpmUtil.resolvedToSourceType(resolved);
  }

  static hasPathTypePackages(): boolean {
    const packages = NpmUtil.getPackages();

    packages.dependencies.forEach(
      (packageName: INpmPackageLockName) => {
        if (
          packageName.resolved &&
          packageName.resolved.substr(0, 5) === 'file:'
        ) {
          return true;
        }

        return false;
      },
    );

    return false;
  }
}
