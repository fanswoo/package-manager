import { execSync } from 'child_process';
import PackageSource from '@/package-source/contracts/package-source';
import DependenceClone from '@/npm-dependence/dependence-clone';
import DependenceRemove from '@/npm-dependence/dependence-remove';
import NpmUtil from '@/utils/npm-util';
import {
  IPackagistSource,
  IGithubSource,
  IPathSource,
} from '@/package-source/contracts/package';

export default class NpmPackageSource extends PackageSource {
  protected platform: string = 'npm';

  public isPackageTypeEqual(): boolean {
    if (NpmUtil.getPackageType(this.packageName) === this.source) {
      return true;
    }

    return false;
  }

  public changeType(): boolean {
    this.initPackageSource();

    switch (this.source) {
      case 'github': {
        this.packageSource = this.packageSource as IGithubSource;
        const url = `github:${this.packageSource.name}`;

        let branch = '';
        if (this.packageSource.branch) {
          branch = `#${this.packageSource.branch}`;
        }

        if (this.dev) {
          execSync(
            `npm install --save-dev ${this.packageName} ${url}${branch}`,
          );
          break;
        }

        execSync(`npm install ${this.packageName} ${url}`);
        break;
      }
      case 'packagist': {
        this.packageSource = this.packageSource as IPackagistSource;
        const { version } = this.packageSource;

        if (this.dev) {
          execSync(
            `npm install --save-dev ${this.packageName} ${version}`,
          );
          break;
        }

        execSync(`npm install ${this.packageName} ${version}`);
        break;
      }
      case 'path': {
        const packageSource = this.packageSource as IPathSource;
        const url = `file:${packageSource.path}`;

        if (this.dev) {
          execSync(
            `npm install --save-dev ${this.packageName} ${url}`,
          );
          break;
        }

        execSync(`npm install ${this.packageName} ${url}`);
        break;
      }
      default:
        break;
    }

    this.handleDependence();

    return true;
  }

  protected handleDependence() {
    const {
      dependenceDistDirectory,
      dependenceNamespace,
      newDependencePackageName,
    } = this.getDependenceData();

    if (this.source === 'path') {
      const packageSource = this.packageSource as IPathSource;

      const dependenceClone = new DependenceClone({
        src: packageSource.path,
        dist: `${dependenceDistDirectory}/${newDependencePackageName}`,
        name: `@${dependenceNamespace}/${newDependencePackageName}`,
      });
      dependenceClone.run();
    } else {
      const dependenceRemove = new DependenceRemove({
        dist: `${dependenceDistDirectory}/${newDependencePackageName}`,
        name: `@${dependenceNamespace}/${newDependencePackageName}`,
      });
      dependenceRemove.run();
    }
  }

  protected getDependenceData() {
    const { dependenceDistDirectory, dependenceNamespace } =
      this.config.platforms.find((item) => item.name === 'npm')!;

    const newDependencePackageName = this.packageName
      .replace(/@/g, '')
      .replace(/\//g, '-');

    return {
      dependenceDistDirectory,
      dependenceNamespace,
      newDependencePackageName,
    };
  }
}
