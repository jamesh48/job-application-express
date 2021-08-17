const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { jobSearchTerms: { searchJobTitle, searchJobLocation } } = require('./rootConfig.js');

module.exports = {
  buildDriver: () => {
    const _http = require('selenium-webdriver/http');
    require('selenium-webdriver/chrome');
    require('chromedriver');
    const builder = new Builder();
    builder.forBrowser('chrome');
    const options = new Options();
    options.addArguments(`user-data-dir=${process.env.CHROMEPROFILE}`);
    builder.setChromeOptions(options);
    const driver = builder.build();

    // Turns off 30 second default async script timeout
    driver.manage().setTimeouts({ script: null })
    return driver;
  },
  openIndeed: async (driver) => {
    let preppedTitle = searchJobTitle.split(' ');
    preppedTitle = preppedTitle.join('%20');
    const startUrl = `https://www.indeed.com/jobs?q=${preppedTitle}&l=${searchJobLocation}&sort=date&limit=50`;
    await driver.get(startUrl);
    await driver.manage().window().maximize();
  },
  filterJobPostings: (driver) => {
    // Remove Jobs with external Postings.
    driver.executeScript(
      `document.querySelectorAll('.tapItem').forEach((tapItemNode) => {
      let test = tapItemNode.querySelector('.indeedApply');
      if (!test) {
        tapItemNode.remove();
      }
    })`
    )

    // Remove Already Applied jobs from the list
    driver.executeScript(`
      const nodeList = document.querySelectorAll('.applied-snippet');

      nodeList.forEach((node) => {
        const toRemove = node.closest('.tapItem');
        toRemove.remove();
      })
    `);
    return;
  }
}