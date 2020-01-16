import {
  extractDoctype,
  extractStartTagOpen,
  extractAttribute,
  extractStartTagClose,
  extractCloseTag,
  extractText,
  extractComment,
  extractConditionComment
} from "@/learn-vue/compiler/parser/utils";

test("test eat up doctype", () => {
  const doctype = "<!doctype html5>";
  const str = "<p>hello world</p>";
  const html = doctype + str;
  expect(extractDoctype(html)).toBe(str);
  expect(extractDoctype(str)).toBe(str);
});

test("test extract start tag from html", () => {
  const tag = "p";
  const html = `<${tag}>extract start tag from html</${tag}>`;
  const match = extractStartTagOpen(html);

  expect(match[1]).toBe(tag);
});

test("test extract single attribute from html", () => {
  const singleProp = "checked";
  const singlePropHtml = `${singleProp} name="name" />`;
  expect(extractAttribute(singlePropHtml)[1]).toBe(singleProp);
});

test("test extract pair attribute from html", () => {
  const pairProps = {
    key: "value",
    value: "hello world"
  };
  const pairPropsHtml = `${pairProps.key} = "${pairProps.value}" />`;
  const pairPropsMatch = extractAttribute(pairPropsHtml);

  expect(pairPropsMatch[1]).toBe(pairProps.key);
  expect(pairPropsMatch[3] || pairPropsMatch[4] || pairPropsMatch[5]).toBe(
    pairProps.value
  );
});

test("test quotation mark attribute value", () => {
  const key = `key=`;
  const baseValue = "value";
  const value = "hello world";
  const quotationValue = `'${value}'`;
  const dbQuotationValue = `"${value}"`;
  const errorQuotationValue = `"${value}'`;
  const errMatch = extractAttribute(key + errorQuotationValue);

  expect(extractAttribute(key + quotationValue)[3]).toBe(value);
  expect(extractAttribute(key + dbQuotationValue)[4]).toBe(value);
  expect(extractAttribute(key + baseValue)[5]).toBe(baseValue);
  expect(errMatch[3] || errMatch[4] || errMatch[5]).toBeUndefined();
});

test("test extract start tag close", () => {
  const startTagCloseHtml = "/ ><p></p>";
  const errStartTagCloseHtml = "><p></p>";

  expect(extractStartTagClose(startTagCloseHtml)).not.toBeNull();
  expect(extractStartTagClose(errStartTagCloseHtml)).not.toBeNull();
});

test("test extract close tag", () => {
  const html = "< / div >";

  expect(extractCloseTag(html)[1]).toBe("div");
});

test("test extract plain text", () => {
  const plainText = "hello world";
  const containTag = plainText + `<p>paragraph</p>`;
  // need to escape "<"
  const containStartTagOpen = `${plainText} &lt; ${plainText}<p>paragraph</p>`;

  expect(extractText(plainText)).toBe(plainText);
  expect(extractText(containTag)).toBe(plainText);
  expect(extractText(containStartTagOpen)).toBe(
    `${plainText} &lt; ${plainText}`
  );
});

test("test extract comment", () => {
  const comment = "comment content";
  const html = `<!--${comment}-->`;
  expect(extractComment(html).text).toBe(comment);
});

test("test extract condition comment", () => {
  const conditionComment = "condition comment";
  const html = `<![${conditionComment}]>`;
  expect(extractConditionComment(html).text).toBe(conditionComment);
});
