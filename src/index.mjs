#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");

let campaignFile;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  //   prompt: "peruggia> ",
});

console.log(
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
          console.log(
            `\nCould not find file ${err.path}. Please confirm the campaign exists in this location and try again.\n`
          );
          return QuestionOne();
        }

        campaignFile = data;
        console.log("fileread", typeof campaignFile);

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

    const pth = path.resolve(__dirname, folder);

    fs.mkdir(pth, { recursive: true }, (err) => {
      if (err) {
        console.log(
          `Could not create folder ${pth}. Please check folder permissions and try again.`
        );
        return rl.close();
      }
    });

    console.log(`\nWriting files to ${pth}`);

    fs.writeFile(`${pth}/testfile.xml`, campaignFile, (err) => {
      if (err) {
        console.log("\n Error writing file", err);
        return;
      }

      console.log("\nperrugia finished writing files.");
      rl.close();
    });
  });
}

rl.on("close", () => {
  console.log("\nExiting peruggia.\n");
  process.exit(0);
});
