"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
const commander_1 = require("commander");
class Bootstrap {
    run() {
        const env = dotenv_1.default.config().parsed;
        this.commander = new commander_1.Command();
        this.commander
            .option('--disable-module-alias', 'enter source path')
            .allowUnknownOption()
            .parse();
        const options = this.commander.opts();
        process.argv = process.argv.filter((item) => item !== '--disable-module-alias');
        if (!options.disableModuleAlias) {
            require('module-alias/register'); // eslint-disable-line global-require
        }
        if (env) {
            // env
        }
    }
}
const bootstrap = new Bootstrap();
bootstrap.run();
