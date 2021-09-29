import PackageUtil from '@/utils/package-util';
import {
  IPackagistSource,
  IGithubSource,
  IPathSource,
} from '@/package-source/contracts/package';

export default abstract class PackageSource {
  protected dev: boolean = false;

  protected abstract platform: string;

  protected packageSource!:
    | IPackagistSource
    | IGithubSource
    | IPathSource;

  constructor(
    protected packageName: string,
    protected source: string,
  ) {
    this.packageName = packageName;
    this.source = source;

    this.initPackageSource();
  }

  protected initPackageSource() {
    const { platforms } = PackageUtil.getConfig();

    const packageRepository = platforms
      .find((item) => this.platform === item.name)!
      .packages.find((item) => this.packageName === item.name)!;

    if (packageRepository.dev) {
      this.dev = true;
    }

    this.packageSource = packageRepository.sources.find(
      (item: IPackagistSource | IGithubSource | IPathSource) => {
        const sourceName = this.source;
        return sourceName === item.source;
      },
    )!;
  }

  public abstract changeType(): boolean;

  protected abstract isPackageTypeEqual(): boolean;
}
