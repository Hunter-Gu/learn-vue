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
          });
      });
  },
  "test patch vnode data except events"(browser) {
    const newPrefix = "new-";
    const classAndId = "input";
    const value = "hello world";
    browser
      .url(BASE_URL + "patch-vnode-data")
      .waitForElementVisible("input", 1000)
      .assert.attributeContains(classAndId, "class", classAndId)
      .assert.attributeContains(classAndId, "id", classAndId)
      .assert.domPropertyEquals(classAndId, "value", value)
      .assert.domPropertyEquals(classAndId, "style", "color")
      .pause(3000, () => {
        browser
          .waitForElementVisible(classAndId, 1000)
          .assert.attributeContains(classAndId, "class", newPrefix + classAndId)
          .assert.attributeContains(classAndId, "id", newPrefix + classAndId)
          .assert.domPropertyEquals(classAndId, "value", value.toUpperCase())
          .end();
      });
  },
  "test patch portal"(browser) {
    const className = ".patch-portal-container1";
    browser
      .url(BASE_URL + "patch-portal")
      .element("css selector", `div${className} > span`, result => {
        browser.assert.equal(result.status, 0);
      })
      .element("css selector", `div${className} > a`, result => {
        browser.assert.equal(result.status, 0);
      })
      .pause(3000, () => {
        const newClassName = ".patch-portal-container2";

        browser
          .element("css selector", `div${newClassName} > p`, result => {
            browser.assert.equal(result.status, 0);
          })
          .element("css selector", `div${newClassName} > span`, result => {
            browser.assert.equal(result.status, 0);
          })
          .end();
      });
  }
};
