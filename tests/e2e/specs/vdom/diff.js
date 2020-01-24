const BASE_URL = "http://localhost:8080/example/diff/";

module.exports = {
  "test diff algorithm"(browser) {
    const prev = [1, 2, 3, 4];
    const next = [2, 3, 1, 5, 6, 7];
    const assertText = arr =>
      arr.reduce(
        (_browser, clsAndText, i) =>
          _browser.assert.containsText(
            `ul > li:nth-of-type(${i + 1})`,
            clsAndText
          ),
        browser
      );
    browser
      .url(BASE_URL + "diff")
      .waitForElementVisible("ul", 1000)
      .elements("css selector", "ul > li", () => {
        assertText(prev)
          .expect.elements("li")
          .count.to.equal(4);
      })
      .pause(3000, () => {
        browser.elements("css selector", "ul > li", () => {
          assertText(next)
            .expect.elements("li")
            .count.to.equal(6);
        });
      });
  }
};
