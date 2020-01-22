const BASE_URL = "http://localhost:8080/example/patch/";

module.exports = {
  "test patch plain text"(browser) {
    const className = ".patch-text-container";
    const text = "hello world";
    browser
      .url(BASE_URL + "patch-text")
      .waitForElementVisible(className, 1000)
      .assert.containsText(className, text)
      .pause(3000, () => {
        browser.assert.containsText(className, text.toUpperCase()).end();
      });
  },
  "test patch html element"(browser) {
    browser
      .url(BASE_URL + "patch-html-element")
      .waitForElementVisible("p", 1000)
      .pause(3000, () => {
        browser.waitForElementVisible("a", 1000).end();
      });
  },
  "test patch children"(browser) {
    browser
      .url(BASE_URL + "patch-children")
      .waitForElementVisible("#patch-children-container", 1000)
      .element("css selector", `div > p`, result => {
        browser.assert.equal(result.status, 0);
      })
      .pause(3000, () => {
        browser
          .waitForElementNotPresent("p", 1000)
          .element("css selector", `div > span`, result => {
            browser.assert.equal(result.status, 0);
          })
          .end();
      });
  }
};
