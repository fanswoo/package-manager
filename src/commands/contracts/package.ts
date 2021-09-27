export interface INpmPackageLockName {
  resolved: string;
}

export interface IComposerPackageLockName {
  type: string;
  url: string;
  dist?: {
    type: string;
  };
}

export interface IGithubSource {
  source: string;
  name: string;
  branch: string;
}

export interface IPathSource {
  source: string;
  path: string;
}

export interface IPackagistSource {
  source: string;
  version: string;
}

// export interface IComposerPackageSource {
//   source: string;
//   path: IPathSource;
//   github: IGithubSource;
// }

// export interface INpmPackageSource {
//   source: string;
//   path: IPathSource;
//   github: IGithubSource;
//   packagist: IPackagistSource;
// }

export interface IPackageRepository {
  name: string;
  dev: boolean;
  sources: // | IComposerPackageSource[]
  // | INpmPackageSource[]
  (IPackagistSource | IPathSource | IGithubSource)[];
}

export interface IPlatform {
  name: string;
  dependenceNamespace: string;
  dependenceDistDirectory: string;
  packages: IPackageRepository[];
}

export interface IPackageConfig {
  platforms: IPlatform[];
}
