import sax from "sax";
import { isNil, lensPath, view, set, prop } from "ramda";

const parser = sax.parser(true, {});

const FORMAT_TAGS = {
  u: "",
  i: "_",
  b: "**",
};

let result = {};
let currentPath = [];

parser.ontext = function (t) {
  const text = t.replace(/\n/gm, "").replace(/\s+/g, " ").trim();

  if (text !== "") {
    const lens = lensPath([...currentPath, "text"]);
    const oldT = view(lens, result) || "";
    result = set(lens, `${oldT} ${text}`.trim(), result);
  }
};

parser.onopentag = function (node) {
  const { name, attributes } = node;
  const formatTag = prop(name, FORMAT_TAGS);

  if (isNil(formatTag)) {
    currentPath.push(name);
    const lens = lensPath(currentPath);
    const data = view(lens, result);

    if (isNil(data)) {
      result = set(lens, { attributes }, result);
    } else {
      const tagArr = [].concat(data, { attributes });
      const lastIndex = tagArr.length - 1;
      result = set(lens, tagArr, result);
      currentPath.push(lastIndex);
    }
  } else {
    parser.ontext(formatTag);
  }
};

parser.onclosetag = function pops(tag) {
  const formatTag = prop(tag, FORMAT_TAGS);

  if (isNil(formatTag)) {
    const lastTag = currentPath.pop();
    if (typeof lastTag === "number") currentPath.pop();
  } else {
    parser.ontext(formatTag);
  }
};

export default (xml) => {
  result = {};
  currentPath = [];

  parser.write(xml).close();

  return result;
};
