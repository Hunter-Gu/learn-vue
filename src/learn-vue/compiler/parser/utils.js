const TAG_OPEN_SYM = "<";
const TAG_CLOSE_SYM = ">";
const VALID_KEY = `([^\\s${TAG_CLOSE_SYM}]+)`;

const START_TAG_OPEN_EXP = new RegExp(`^${TAG_OPEN_SYM}\\s*${VALID_KEY}`);
export function extractStartTagOpen(html) {
  let match = null;
  if ((match = html.match(START_TAG_OPEN_EXP))) {
    return match;
  }
}

const ATTR_AND_PROPS_EXP = new RegExp(
  `^\\s*${VALID_KEY}(\\s*=\\s*${VALID_KEY})?`
);
export function extractAttrsAndProps(html) {
  let match = null;
  if ((match = html.match(ATTR_AND_PROPS_EXP))) {
    return match;
  }
}

const START_TAG_CLOSE_EXP = new RegExp(`^\\s*\\/?\\s*${TAG_CLOSE_SYM}`);
export function extractStartTagClose(html) {
  let match = null;
  if ((match = html.match(START_TAG_CLOSE_EXP))) {
    return match;
  }
}

export function extractText(html) {
  let text = "";
  let idx = html.indexOf(TAG_OPEN_SYM);
  const validIdx = idx => idx >= 0;
  if (validIdx(idx)) {
    text += html.slice(0, idx);
    html = html.slice(idx);
  }

  return text;
}

export function advance(str, len) {
  str = str.slice(len);
}
