import { execSync } from 'child_process';
import PackageSource from '@/package-source/contracts/package-source';
import ComposerUtil from '@/utils/composer-util';
import {
  IGithubSource,
  IPathSource,
} from '@/package-source/contracts/package';

export default class ComposerPackageSource extends PackageSource {
  protected platform: string = 'composer';

  public isPackageTypeEqual(): boolean {
    if (
      ComposerUtil.getPackageType(this.packageName) === this.source
    ) {
      return true;
    }

    return false;
  }

  public changeType(): boolean {
    this.initPackageSource();

    try {
      execSync(`composer remove ${this.packageName}`);
    } catch (error) {
      let errorMessage = 'error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
    }

    switch (this.source) {
      case 'github': {
        const packageSource = this.packageSource as IGithubSource;
        const url = `git@github.com:${packageSource.name}.git`;

        execSync(
          `composer config repositories.${this.packageName} git ${url}`,
        );

        const version = `dev-${packageSource.branch}`;

        execSync(`composer require ${this.packageName}:${version}`);
        break;
      }
      case 'path': {
        const packageSource = this.packageSource as IPathSource;
        const url = packageSource.path;

        execSync(
          `composer config repositories.${this.packageName} path ${url}`,
        );
        execSync(`composer require ${this.packageName}`);
        break;
      }
      default:
        break;
    }

    execSync('php ff framework:published');

    return true;
  }
}
