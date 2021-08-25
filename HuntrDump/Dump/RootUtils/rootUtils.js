const { Builder } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

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
  openHuntr: async (driver) => {
    const startUrl = `https://www.huntr.co`;
    await driver.get(startUrl);
    await driver.manage().window().maximize();
  },
  loginToHuntr: async (driver) => {
    const [emailInput, passwordInput] = await driver.findElements(By.xpath(`//input`));
    await emailInput.sendKeys(process.env.HUNTREMAIL);
    await passwordInput.sendKeys(process.env.HUNTRPASSWORD);
    await driver.findElement(By.xpath(`//a[contains(., 'Continue')]`)).click();
    // Wait until the next button is available...
    await driver.wait(until.elementLocated(By.xpath(`//a[contains(@class, 'add-job-block')]`)));
    return;
  }
}