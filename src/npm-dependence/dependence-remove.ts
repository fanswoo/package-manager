import fs from 'fs';
import colors from 'colors';
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

    console.log(colors.green('execution succeed'));
  }

  protected removeDependencePackage() {
    fs.rmSync(`${process.cwd()}/${this.dist}`, {
      recursive: true,
    });
  }

  protected uninstallDependencePackage() {
    const output = execSync(`npm uninstall ${this.name}`).toString();
    console.log(output);
  }
}
