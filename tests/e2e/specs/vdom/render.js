module.exports = {
  "text render plain text"(browser) {
    browser
      .url("http://localhost:8080/text/render-plain-text")
      .assert.containsText("#render-plain-text-container", "123")
      .end();
  },
  "test render html element"(browser) {
    browser
      .url("http://localhost:8080/test/render-html-element")
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render svg element"(browser) {
    browser
      .url("http://localhost:8080/test/render-html-element")
      .waitForElementVisible("svg", 1000)
      .end();
  },
  "test render stateful component"(browser) {
    browser
      .url("http://localhost:8080/test/render-comp")
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render functional component"(browser) {
    browser
      .url("http://localhost:8080/test/render-comp")
      .waitForElementVisible("p", 1000)
      .end();
  },
  "test render fragment"(browser) {
    browser
      .url("http://localhost:8080/test/render-fragment")
      .waitForElementVisible("p", 1000)
      .waitForElementVisible("span", 1000)
      .end();
  },
  "test render portal"(browser) {
    browser
      .url("http://localhost:8080/test/render-portal")
      .waitForElementVisible("span", 1000)
      .end();
  }
};
