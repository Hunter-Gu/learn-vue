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
  }
};
