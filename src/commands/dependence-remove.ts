import fs from 'fs';
import { execSync } from 'child_process';

export default class DependenceRemove {
  name: string; // 目標套件名稱

  dist: string; // 目標套件資料夾

  constructor(arg: { name: string; dist: string }) {
    this.name = arg.name;
    this.dist = arg.dist;
  }

  run() {
    this.uninstallDependencePackage();
    this.removeDependencePackage();

    console.log('%c execution succeed', 'color: green;');
  }

  protected removeDependencePackage() {
    fs.rmdirSync(`${process.cwd()}/${this.dist}`, {
      recursive: true,
    });
  }

  protected uninstallDependencePackage() {
    const output = execSync(`npm uninstall ${this.name}`).toString();
    console.log(output);
  }
}
