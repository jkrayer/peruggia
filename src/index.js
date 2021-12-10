#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'peruggia> '
});

rl.prompt();

rl
  .on('line', (input) => {
    if (input === 'exit') {
      rl.close();
    }
    rl.prompt();
  })
  .on('close', () => {
    console.log('\nExiting peruggia.\n');
    process.exit(0);
  });
