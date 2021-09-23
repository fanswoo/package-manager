#!/usr/bin/env ts-node

import argv from 'process.argv';
import DependenceClone from '@/commands/dependence-clone';

const processArgv = argv(process.argv.slice(2));

const config: {
  '--': string;
} = processArgv({
  '--': 'dependence-clone',
});

const command: string = config['--'];

if (command === 'dependence-clone') {
  const dependenceCloneInstance = new DependenceClone();
  dependenceCloneInstance.run();
} else {
  console.warn('you have to provider command name');
}
