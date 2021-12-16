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
  split,
  test,
  toPairs,
} from "ramda";
import eleventy from "./generators.mjs";

// ----- Helpers -----

// isLog:: String -> Boolean
const isLog = test(/^id/);

// notEmpty:: Any -> Boolean
const notEmpty = compose(not, isEmpty);

// notNIl:: Any -> Boolean
const notNil = compose(not, isNil);

// hasContent:: Logentry -> Boolean
const hasContent = (x) => notEmpty(x.p) || notNil(x.linklist); // propSatisfies(notNil, "linklist");

// hasLogentry:: CalendarItem -> Boolean
const hasLogentry = compose(hasContent, pathOr({}, ["logentry"]));

// getText:: Object -> String
const getText = prop("_text");

// getLink:: Object -> String
const getLink = prop("link");

// joinNewLine:: Array -> String
const joinNewLine = join("\n\n");

// getId:: Link -> String
const getId = path(["_attributes", "recordname"]);

// ----- Parsers -----

// getParsedEntry:: Id -> FormattedText
let getParsedEntry;

// initFinder:: CampaignJSON -> Id -> Resource
const initFinder = (campaignFile) => (id) =>
  path(["root", ...id.split(".")], campaignFile);

// parseP:: Paragraph -> String
const parseP = (p) =>
  Array.isArray(p) ? joinNewLine(map(getText, p)) : getText(p);

// parseLL:: linkedlist -> String
const parseLL = (ll) =>
  Array.isArray(ll.link)
    ? join("\n\n", map(getText, ll.link))
    : getText(ll.link);

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

const parseEntry = (entry) => {
  const entryTitle = `## ${pathOr("", ["name", "_text"], entry)}`;
  const { p, linklist } = entry.text;

  // console.log("entry", entry);
  // console.log("entry?title", entryTitle);
  // console.log("entry?p", p);
  // console.log("entry?ll", linklist);
};

// parseLogEntry:: CalendarEntry -> String
const parseLogEntry = (logentry) => {
  const { p, linklist } = logentry;
  let body = "";

  if (!isNil(p)) {
    body = `${body}${parseP(logentry.p)}`;
  }

  if (!isNil(linklist)) {
    const links = Array.isArray(linklist)
      ? linklist.flatMap(getLink)
      : [].concat(getLink(linklist));

    links.map(getParsedEntry);

    // body = `${body}\n\n${getEntries(links)}`

    // body = `${body}\n\n${entries.join()}`;

    // links.map(compose(joinNewLine, parseEntry, getEntry, getId));

    // joinNewLine(entries);

    // console.log("links", links);

    // console.log("LL", JSON.stringify(logentry.linklist));
    // body = `${body}${parseLL(logentry.linklist)}`;
  }

  return body;
};

// getCalendar:: FantasyGroundsDB -> [Id, String][]
const getCalendar = compose(
  map(([key, { logentry, name }]) => [
    key,
    eleventy(getText(name), parseLogEntry(logentry)),
  ]),
  filter(([key, data]) => isLog(key) && hasLogentry(data)),
  toPairs,
  pathOr({}, ["root", "calendar", "log"])
);

const parseCalendar = (campaignFile) => {
  getParsedEntry = compose(parseEntry, initFinder(campaignFile), getId);

  return getCalendar(campaignFile);
};

export default parseCalendar;

// (fn, [a, b]) => return [fn(a), b]
// merge link lists
