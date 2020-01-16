const TAG_OPEN_SYM = "<";
const TAG_CLOSE_SYM = ">";
const VALID_KEY = `([^\\s${TAG_OPEN_SYM}${TAG_CLOSE_SYM}]+)`;

const START_TAG_OPEN_EXP = new RegExp(`^${TAG_OPEN_SYM}\\s*${VALID_KEY}`);
export function extractStartTagOpen(html) {
  return html.match(START_TAG_OPEN_EXP);
}

const ATTRIBUTE = `[^\\s'"${TAG_OPEN_SYM}${TAG_CLOSE_SYM}=]+`;
const ATTRIBUTES_EXP = new RegExp(
  `^\\s*(${ATTRIBUTE})(?:\\s*(=)\\s*(?:'([^']*)'|"([^"]*)"|(${ATTRIBUTE})))?`
);
export function extractAttribute(html) {
  return html.match(ATTRIBUTES_EXP);
}

const START_TAG_CLOSE_EXP = new RegExp(`^\\s*\\/?\\s*${TAG_CLOSE_SYM}`);
export function extractStartTagClose(html) {
  return html.match(START_TAG_CLOSE_EXP);
}

const CLOSE_TAG_EXP = `^${TAG_OPEN_SYM}\\s*\\/\\s*${VALID_KEY}\\s*${TAG_CLOSE_SYM}`;
export function extractCloseTag(html) {
  return html.match(CLOSE_TAG_EXP);
}

const validIdx = idx => idx >= 0;

/**
 * @description extract plain text from html
 * @example
 *  extract<p>not extracted</p> -> extract
 *  extract<extract<p>not extracted</p> -> extract<extract
 *  [TODO]extract</extract<p>not extracted</p> -> extract</extract
 */
const getStartTagIdx = html => html.indexOf(TAG_OPEN_SYM);
export function extractText(html) {
  let text = "";
  let idx = getStartTagIdx(html);
  if (validIdx(idx)) {
    do {
      text += retreat(html, idx);
      html = advance(html, idx);
    } while (
      !START_TAG_OPEN_EXP.test(html) &&
      validIdx((idx = getStartTagIdx(html)))
    );
  } else {
    text = html;
  }

  return text;
}

const COMMENT_EXP = new RegExp(`^${TAG_OPEN_SYM}!--`);
const COMMENT_CLOSE = "--" + TAG_CLOSE_SYM;
export function extractComment(html) {
  const match = html.match(COMMENT_EXP);

  if (match) {
    const idx = html.indexOf(COMMENT_CLOSE);
    if (validIdx(idx)) {
      const text = retreat(html, idx, match[0].length);
      html = advance(html, idx);

      return { text, html };
    }
  }
}

const CONDITION_COMMENT_OPEN_EXP = new RegExp(`^${TAG_OPEN_SYM}!\\[`);
const CONDITION_COMMENT_CLOSE = "]" + TAG_CLOSE_SYM;
export function extractConditionComment(html) {
  const match = html.match(CONDITION_COMMENT_OPEN_EXP);
  if (match) {
    const idx = html.indexOf(CONDITION_COMMENT_CLOSE);
    if (validIdx(idx)) {
      const text = retreat(html, idx, match[0].length);
      html = advance(html, idx + CONDITION_COMMENT_CLOSE.length);
      return {
        text,
        html
      };
    }
  }
}

export function retreat(str, idx, start = 0) {
  return str.slice(start, idx);
}

export function advance(str, len) {
  return str.slice(len);
}
