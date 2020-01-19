const BASE_URL = "http://localhost:8080/example/render/";

module.exports = {
  "test render plain text"(browser) {
    browser
      .url(BASE_URL + "render-plain-text")
      .assert.containsText("#render-plain-text-container", "1234")
      .end();
  },
  "test render html element"(browser) {
    browser
      .url(BASE_URL + "render-html-element")
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render svg element"(browser) {
    browser
      .url(BASE_URL + "render-html-element")
      .waitForElementVisible("svg", 1000)
      .end();
  },
  "test render stateful component"(browser) {
    browser
      .url(BASE_URL + "render-comp")
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render functional component"(browser) {
    browser
      .url(BASE_URL + "render-functional-comp")
      .waitForElementVisible("p", 1000)
      .end();
  },
  "test render fragment"(browser) {
    browser
      .url(BASE_URL + "render-fragment")
      .waitForElementVisible("p", 1000)
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render portal"(browser) {
    browser
      .url(BASE_URL + "render-portal")
      .waitForElementVisible("span", 1000)
      .end();
  }
};
