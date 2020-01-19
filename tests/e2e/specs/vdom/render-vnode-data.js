const BASE_URL = "http://localhost:8080/example/render/";

module.exports = {
  "test render classname"(browser) {
    browser
      .url(BASE_URL + "render-classname")
      .waitForElementVisible(".render-classname-container", 1000)
      .end();
  },
  "test render dom attributes"(browser) {
    browser
      .url(BASE_URL + "render-attrs")
      .waitForElementVisible(".render-attrs-container", 1000)
      .assert.attributeContains(".render-attrs-container", "align", "left")
      .assert.attributeContains(".render-attrs-container", "width", "100px")
      .end();
  },
  "test render dom properties"(browser) {
    const classname = ".render-props-container";
    browser
      .url(BASE_URL + "render-props")
      .waitForElementVisible(classname, 1000)
      .assert.domPropertyEquals(classname, "type", "radio")
      .assert.domPropertyEquals(classname, "checked", true)
      .end();
  },
  "test render dom style"(browser) {
    const classname = ".render-style-container";
    browser
      .url(BASE_URL + "render-style")
      .waitForElementVisible(classname, 1000)
      .assert.domPropertyEquals(classname, "style", "width,height")
      .end();
  },
  "test render events"(browser) {
    const classname = ".render-events-container";
    browser
      .url(BASE_URL + "render-events")
      .waitForElementVisible(classname, 1000)
      .click(classname, function() {
        this.assert.domPropertyEquals(classname, "value", "clicked");
      })
      .end();
  },
  "test render children"(browser) {
    const classname = ".render-children-container";
    const childClassName = ".child";
    browser
      .url(BASE_URL + "render-children")
      .waitForElementPresent(classname, 1000, function() {
        browser.expect.elements(classname).count.to.equal(3);
        browser.expect.elements(childClassName).count.to.equal(4);
        browser.end();
      });
  }
};
