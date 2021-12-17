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
const getText = prop("text");

// getLink:: Object -> String
const getLink = prop("link");

// joinNewLine:: Array -> String
const joinNewLine = join("\n\n");

// getId:: Link -> String
const getId = path(["attributes", "recordname"]);

// toArray:: Any -> Any[]
const toArray = (x) => [].concat(x);

// ----- Parsers -----

// getParsedEntry:: Id -> FormattedText
let getParsedEntry;

// initFinder:: CampaignJSON -> Id -> Resource
const initFinder = (campaignFile) => (id) =>
  path(["root", ...id.split(".")], campaignFile);

// parseP:: Paragraph[] -> String
const parseP = compose(joinNewLine, map(getText));

// parseH::
const parseH = compose(join("\n\n### "), map(getText));

// parseList::
const parseLI = compose((x) => `\n - ${x}`, getText);

//
const parseEntry = (entry) => {
  const name = pathOr("", ["name", "text"], entry);

  const ps = compose(parseP, toArray, pathOr([], ["text", "p"]))(entry);

  const hs = compose(parseH, toArray, pathOr([], ["text", "h"]))(entry);

  const lists = compose(
    join(""),
    map(parseLI),
    pathOr([], ["text", "list", "li"])
  )(entry);

  const x = compose(parseEntry, getParsedEntry);

  const links = compose(
    joinNewLine,
    map(x),
    getLinkIds,
    pathOr([], ["text", "linklist"])
  )(entry);

  return [`## ${name}`, ps, hs, lists, links].join("\n\n");
};

const flattenLinks = (linklist) =>
  Array.isArray(linklist)
    ? linklist.flatMap(getLink)
    : [].concat(getLink(linklist));

const getLinkIds = compose(map(getId), flattenLinks);

// parseLogEntry:: CalendarEntry -> String
const parseLogEntry = (logentry) => {
  const { p, linklist } = logentry;
  let body = "";

  if (!isNil(p)) {
    const ps = [].concat(p);
    body = `${body}${parseP(ps)}`;
  }

  if (!isNil(linklist)) {
    const links = getLinkIds(linklist);
    const a = map(parseEntry, map(getParsedEntry, links));
    console.log("entry:", joinNewLine(a));
    body = `${body}\n\n${joinNewLine(a)}`;
  }

  return body;
};

// getCalendar:: FantasyGroundsDB -> [Id, String][]
const getCalendar = compose(
  map(([key, { logentry, name }]) => [
    key,
    eleventy(getText(name), parseLogEntry(logentry)),
  ]),
  // filter needs fixin
  filter(([key, data]) => isLog(key) && hasLogentry(data)),
  toPairs,
  pathOr({}, ["root", "calendar", "log"])
);

const parseCalendar = (campaignFile) => {
  getParsedEntry = initFinder(campaignFile);

  return getCalendar(campaignFile);
};

export default parseCalendar;
