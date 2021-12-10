#!/usr/bin/env node

import readline from "readline";
import fs from "fs";
import path from "path";
import { error, info, success } from "./log.mjs";

let campaignFile;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  //   prompt: "peruggia> ",
});

info(
  '\nStarting peruggia. Type "exit" in any field or press CTRL + C to end. \n'
);

(function QuestionOne() {
  rl.question("What is the name of your campaign? ", (campaign) => {
    if (campaign.toLowerCase() === "exit") {
      return rl.close();
    }

    // TODO: fs.read
    fs.readFile(
      `/Users/jameskrayer/SmiteWorks/Fantasy Grounds/campaigns/${campaign}/db.xml`,
      {
        encoding: "utf-8",
      },
      (err, data) => {
        if (err) {
          error(
            `\nCould not find file ${err.path}. Please confirm the campaign exists in this location and try again.\n`
          );
          return QuestionOne();
        }

        campaignFile = data;

        QuestionTwo();
      }
    );
  });
})();

function QuestionTwo() {
  rl.question("\nWhat folder should peruggia write to?", (folder) => {
    if (folder.toLowerCase() === "exit") {
      return rl.close();
    }

    const pth = path.resolve(folder);

    fs.mkdir(pth, { recursive: true }, (err) => {
      if (err) {
        error(
          `Could not create folder ${pth}. Please check folder permissions and try again.`
        );
        return rl.close();
      }
    });

    console.log(`\nWriting files to ${pth}`);

    fs.writeFile(`${pth}/testfile.xml`, campaignFile, (err) => {
      if (err) {
        error("\n Error writing file", err);
        return;
      }

      success("\nperrugia finished writing files.");
      rl.close();
    });
  });
}

rl.on("close", () => {
  info("\nExiting peruggia.\n");
  process.exit(0);
});
