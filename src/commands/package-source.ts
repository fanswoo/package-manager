import { execSync } from 'child_process';
import PackageUtil from '@/utils/package-util';
import ComposerUtil from '@/utils/composer-util';
import NpmUtil from '@/utils/npm-util';
import {
  IPackagistSource,
  IGithubSource,
  IPathSource,
} from '@/commands/contracts/package';

export default class PackageManager {
  protected dev: boolean = false;

  protected packageSource:
    | IPackagistSource
    | IGithubSource
    | IPathSource;

  constructor(
    protected platform: string,
    protected packageName: string,
    protected source: string,
  ) {
    if (!['composer', 'npm'].includes(platform)) {
      throw new Error('本功能僅支持 compose 和 npm 套件管理平台');
    }

    this.platform = platform;
    this.packageName = packageName;
    this.source = source;

    const { platforms } = PackageUtil.getConfig();

    const packageRepository = platforms
      .find((referPlatform) => this.platform === referPlatform.name)!
      .packages.find(
        (referPackage) => this.packageName === referPackage.name,
      )!;

    if (packageRepository.dev) {
      this.dev = true;
    }

    this.packageSource = packageRepository.sources.find(
      (
        referSource: IPackagistSource | IGithubSource | IPathSource,
      ) => {
        const sourceName = this.source;
        return sourceName === referSource.source;
      },
    )!;
  }

  public isPackageTypeEqual(): boolean {
    switch (this.platform) {
      case 'composer':
        if (
          ComposerUtil.getPackageType(this.packageName) ===
          this.source
        ) {
          return true;
        }
        break;
      case 'npm':
        if (
          NpmUtil.getPackageType(this.packageName) === this.source
        ) {
          return true;
        }
        break;
      default:
        throw new Error('本功能僅支持 compose 和 npm 套件管理平台');
    }

    return false;
  }

  public changeType() {
    switch (this.platform) {
      case 'composer':
        return this.changeTypeByComposer();
      case 'npm':
        return this.changeTypeByNpm();
      default:
        return false;
    }
  }

  protected changeTypeByNpm() {
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

        execSync('npm install {this.packageName} {url}');
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
        this.packageSource = this.packageSource as IPathSource;
        const url = `file:${this.packageSource.path}`;

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
  }

  protected changeTypeByComposer() {
    execSync('composer remove {this.packageName}');

    switch (this.source) {
      case 'github': {
        this.packageSource = this.packageSource as IGithubSource;
        const url = `git@github.com:${this.packageSource.name}.git`;

        execSync(
          `composer config repositories.${this.packageName} git ${url}`,
        );

        const version = `dev-${this.packageSource.branch}`;

        execSync(`composer require ${this.packageName}:${version}`);
        break;
      }
      case 'path': {
        this.packageSource = this.packageSource as IPathSource;
        const url = this.packageSource.path;

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
  }
}
