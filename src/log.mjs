import chalk from "chalk";

const colorMessage =
  (fn) =>
  (...messages) =>
    console.log(fn(...messages));

export const error = colorMessage(chalk.red);

export const info = colorMessage(chalk.cyan);

export const success = colorMessage(chalk.green);
