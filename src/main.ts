import 'module-alias/register';
import PackageSource from '@/package-source/contracts/package-source';
import NpmPackageSource from '@/package-source/npm-package-source';
import ComposerPackageSource from '@/package-source/composer-package-source';
import DependenceRemove from '@/npm-dependence/dependence-remove';
import DependenceClone from '@/npm-dependence/dependence-clone';

export default {
  PackageSource,
  NpmPackageSource,
  ComposerPackageSource,
  DependenceRemove,
  DependenceClone,
};
