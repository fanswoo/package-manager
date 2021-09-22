#!/usr/bin/env node

var argv = require("process.argv");
var processArgv = argv(process.argv.slice(2));
var config = processArgv({
    foo: "AAA",
    bar: {
        buz: "BBB"
    }
});

var args = config["--"] || [];
args.forEach(function (arg: any) {
    console.log(arg);
});

console.log(args);
