import {
  compose,
  filter,
  isEmpty,
  isNil,
  join,
  map,
  not,
  path,
  pathOr,
  prop,
  reduce,
  replace,
  test,
  toPairs,
} from "ramda";
import eleventy from "./generators.mjs";

// const title = replace(/'|\s|:/g, "");
// const noteName = compose(title, path(["name", 0, "_"]));
// const noteCopy = compose(join("\n"), path(["text", 0, "p"]));

// const parseNote = (acc, [, [note]]) => {
//   return acc.concat([[noteName(note), noteCopy(note)]]);
// };

// const parseNotes = compose(
//   reduce(parseNote, []),
//   toPairs,
//   path(["root", "notes", 0])
// );

const isLog = test(/^id/);
const notEmpty = compose(not, isEmpty);
const notNil = compose(not, isNil);
const hasContent = (x) => notEmpty(x.p) || notNil(x.linklist); // propSatisfies(notNil, "linklist");
const hasLogentry = compose(hasContent, pathOr({}, ["logentry"]));
const getText = prop("_text");

const parseP = (p) =>
  Array.isArray(p) ? join("\n\n", map(getText, p)) : getText(p);

const parseLL = (ll) =>
  Array.isArray(ll.link)
    ? join("\n\n", map(getText, ll.link))
    : getText(ll.link);

const parseLogEntry = (logentry) => {
  let body = "";

  if (!isNil(logentry.p)) {
    body = `${body}${parseP(logentry.p)}`;
  }

  if (!isNil(logentry.linklist)) {
    body = `${body}${parseLL(logentry.linklist)}`;
  }

  return body;
};

//
const getCalendar = compose(
  map(([key, { logentry, name }]) => [
    key,
    eleventy(getText(name), parseLogEntry(logentry)),
  ]),
  filter(([key, data]) => isLog(key) && hasLogentry(data)),
  toPairs,
  pathOr({}, ["root", "calendar", "log"])
);

//
const parseCalendar = (campaignFile) => {
  return getCalendar(campaignFile);
};

export default parseCalendar;
