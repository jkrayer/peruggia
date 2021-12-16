#!/usr/bin/env node

import readline from "readline";
import fs from "fs";
import path from "path";
import { error, info, success } from "./log.mjs";
import parseCalendar from "./js-parser.mjs";
import xmlparser from "./xml-parser.mjs";

let campaignFile;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
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

        campaignFile = xmlparser(data);

        QuestionTwo();
      }
    );
  });
})();

function QuestionTwo() {
  rl.question("\nWhat folder should peruggia write to? ", (folder) => {
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

    // Test File. Remove for Prod
    fs.promises
      .writeFile(`${pth}/test.json`, JSON.stringify(campaignFile))
      .then(() => success(`perrugia wrote file: `))
      .catch((err) => error(`Error writing file; `, err));

    const parsedNotes = parseCalendar(campaignFile);

    const promises = parsedNotes.map(([title, body]) => {
      const filename = path.resolve(pth, `${title}.md`);

      return fs.promises
        .writeFile(filename, body)
        .then(() => success(`perrugia wrote file: ${filename}`))
        .catch((err) => error(`Error writing file; ${filename}`, err));
    });

    // Might add a questions 3, exit or start again
    Promise.all(promises).then(() => rl.close());
  });
}

rl.on("close", () => {
  info("\nExiting peruggia.\n");
  process.exit(0);
});
