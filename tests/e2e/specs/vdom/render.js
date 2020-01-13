module.exports = {
  "test render html element"(browser) {
    browser
      .url("http://localhost:8000/test/render-html-element")
      .waitForElementVisible("span", 3000)
      .end();
  },
  "test render svg element"(browser) {
    browser
      .url("http://localhost:8080/test/render-html-element")
      .waitForElementVisible("svg", 3000)
      .end();
  }
};
