// take the whole tree
// get the notes node
// map over each note
// write a file like path/[NoteName].md
// file contains [NoteText]

import { compose, join, path, reduce, replace, toPairs } from "ramda";

const title = replace(/'|\s|:/g, "");
const noteName = compose(title, path(["name", 0, "_"]));
const noteCopy = compose(join("\n"), path(["text", 0, "p"]));

const parseNote = (acc, [, [note]]) => {
  return acc.concat([[noteName(note), noteCopy(note)]]);
};

const parseNotes = compose(
  reduce(parseNote, []),
  toPairs,
  path(["root", "notes", 0])
);

export default parseNotes;
