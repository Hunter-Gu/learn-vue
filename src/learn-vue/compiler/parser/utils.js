const TAG_OPEN_SYM = "<";
const TAG_CLOSE_SYM = ">";
const VALID_KEY = `([^\\s${TAG_OPEN_SYM}${TAG_CLOSE_SYM}]+)`;

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

const CLOSE_TAG_EXP = `^${TAG_OPEN_SYM}\\s*\\/\\s*${VALID_KEY}\\s*${TAG_CLOSE_SYM}`;
export function extractCloseTag(html) {
  let match = null;

  if ((match = html.match(CLOSE_TAG_EXP))) {
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
const getStartTagIdx = html => html.indexOf(TAG_OPEN_SYM);
export function extractText(html) {
  let text = "";
  let idx = getStartTagIdx(html);
  const validIdx = idx => idx >= 0;
  if (validIdx(idx)) {
    do {
      text += html.slice(0, idx);
      html = html.slice(idx);
    } while (
      !START_TAG_OPEN_EXP.test(html) &&
      validIdx((idx = getStartTagIdx(html)))
    );
  } else {
    text = html;
  }

  return text;
}

export function advance(str, len) {
  str = str.slice(len);
}
