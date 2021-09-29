import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
import { Command } from 'commander';

class Bootstrap {
  protected commander: any;

  run() {
    const env = dotenv.config().parsed!;

    this.commander = new Command();
    this.commander
      .option('--disable-module-alias', 'enter source path')
      .allowUnknownOption()
      .parse();

    const options = this.commander.opts();

    process.argv = process.argv.filter(
      (item) => item !== '--disable-module-alias',
    );

    if (!options.disableModuleAlias) {
      require('module-alias/register'); // eslint-disable-line global-require
      moduleAlias.addAlias('@', path.join(__dirname, '../'));
    }

    if (env) {
      // env
    }
  }
}

const bootstrap = new Bootstrap();
bootstrap.run();
