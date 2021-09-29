import fs from 'fs';
import { execSync } from 'child_process';

export default class DependenceClone {
  src: string; // 來源套件資料夾

  dist: string; // 目標套件資料夾

  name: string; // 目標套件名稱

  constructor(arg: { src: string; dist: string; name: string }) {
    this.src = arg.src;
    this.dist = arg.dist;
    this.name = arg.name;
  }

  run() {
    this.buildDependencePackage();
    this.installDependencePackage();

    console.log('%c execution succeed', 'color: green;');
  }

  protected buildDependencePackage() {
    const srcDependencies = JSON.parse(
      fs
        .readFileSync(`${process.cwd()}/${this.src}/package.json`)
        .toString(),
    ).dependencies;

    const distPackage: {
      name: string;
      dependencies: JSON;
    } = {
      name: this.name,
      dependencies: srcDependencies,
    };

    if (!fs.existsSync(`${process.cwd()}/${this.dist}`)) {
      fs.mkdirSync(`${process.cwd()}/${this.dist}`, {
        recursive: true,
      });
    }

    fs.writeFileSync(
      `${process.cwd()}/${this.dist}/package.json`,
      JSON.stringify(distPackage, null, 2),
    );
  }

  protected installDependencePackage() {
    execSync(`npm install --save-dev file:${this.dist}`).toString();
  }
}
