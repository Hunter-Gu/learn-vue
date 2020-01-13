module.exports = {
  "test render html element"(browser) {
    browser
      .url("http://localhost:8000/test/render-html-element")
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
  }
};
