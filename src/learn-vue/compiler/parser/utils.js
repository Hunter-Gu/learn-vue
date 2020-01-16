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

const ATTRIBUTE = `[^\\s'"${TAG_OPEN_SYM}${TAG_CLOSE_SYM}=]+`;
const ATTRIBUTES_EXP = new RegExp(
  `^\\s*(${ATTRIBUTE})(?:\\s*(=)\\s*(?:'([^']*)'|"([^"]*)"|(${ATTRIBUTE})))?`
);
export function extractAttribute(html) {
  let match = null;
  if ((match = html.match(ATTRIBUTES_EXP))) {
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
/**
 * @description extract plain text from html
 * @example
 *  extract<p>not extracted</p> -> extract
 *  extract<extract<p>not extracted</p> -> extract<extract
 *  extract</extract<p>not extracted</p> -> extract</extract
 */
export function extractText(html) {
  let text = "";
  let idx = html.indexOf(TAG_OPEN_SYM);
  const validIdx = idx => idx >= 0;
  if (validIdx(idx)) {
    html = html.slice(idx);
    text += extractText(html);
  } else {
    text = html;
  }

  return text;
}

export function advance(str, len) {
  str = str.slice(len);
}
