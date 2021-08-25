require('dotenv').config({ path: require('path').resolve('.env') });

const { buildDriver, openHuntr, loginToHuntr } = require('./RootUtils/rootUtils.js');
const { By, Key, until, WebDriver, Actions } = require('selenium-webdriver');
const Promise = require('bluebird');

const axios = require('axios');

module.exports = async () => {
  const driver = await buildDriver();
  await openHuntr(driver);

  const { data: jobApplicationDump } = await axios(`http://localhost:8500/dump`);

  const [fixedHeader, actualLoginButton] = await driver.findElements(By.xpath(`//div[contains(@class, 'flex row grow justify-end menu')]//a[contains(., 'Log in')]`))
  await actualLoginButton.click();
  let needToLoginFlag = false;

  // Wait until Login Screen shows, or the dashboard shows...
  await driver.wait(async () => {
    const loginTest = await driver.findElements(By.xpath(`//p[contains(., 'Log in')]`));
    const alreadyLoggedInTest = await driver.findElements(By.xpath(`//a[contains(@class, 'add-job-block')]`));

    if (loginTest.length) { needToLoginFlag = true; };

    return (loginTest.length || alreadyLoggedInTest.length);
  });

  // Logging In
  if (needToLoginFlag) {
    await loginToHuntr();
  }

  // Impilcit Continue
  const [wishListPlusButton, applicationPlusButton] = await driver.findElements(By.xpath(`//a[contains(@class, 'add-job-block')]`));

  await Promise.each(jobApplicationDump, async (
    { companyName, jobTitle, postURL, advertisedSalary, jobLocation, jobDescription },
    index) => {

    await applicationPlusButton.click();

    // Wait for the Modal Container to Appear...
    await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'ModalContainer')]//input`)));

    // Company Selection and Job Title Input Elements
    const [companySelectionInputEl, jobTitleInputEl] = await driver.findElements(By.xpath(`//div[contains(@class, 'ModalContainer')]//input`));

    await companySelectionInputEl.sendKeys(companyName);
    await jobTitleInputEl.sendKeys(jobTitle);

    // Click Button
    const [discard, saveJob] = await driver.findElements(By.xpath(`//div[contains(@class, 'SmallModal__Footer')]//a`));

    await saveJob.click();

    // Wait for the Job Application Detail Entry Screen to Appear...
    await driver.wait(until.elementLocated(By.xpath(`//input[contains(@placeholder, '+ add URL')]`)));

    // Enter Post URL...
    await driver.findElement(By.xpath(`//input[contains(@placeholder, '+ add URL')]`)).sendKeys(postURL);

    // Enter Salary...
    await driver.findElement(By.xpath(`//input[contains(@placeholder, '+ add salary')]`)).sendKeys(advertisedSalary);

    // Job Location Has to be confirmed by pressing "down + enter" on the keyboard...
    const jobLocationElement = await driver.findElement(By.xpath(`//input[contains(@placeholder, '+ add location')]`))
    await jobLocationElement.sendKeys(jobLocation);
    await driver.sleep(1000);
    await jobLocationElement.sendKeys(Key.ARROW_DOWN, Key.ENTER);

    // Enter Job Description...
    await driver.executeScript(
      `
      const textInput = document.querySelector('.ql-editor');
      textInput.children[0].innerHTML = ${JSON.stringify(jobDescription)}
      textInput.focus();
      `
    )

    await driver.sleep(3000);

    await driver.findElement(By.xpath(`//a[contains(., 'Close')]`)).click();
    // Wait until the add job button is available for the next iteration...
    await driver.wait(until.elementLocated(By.xpath(`//a[contains(@class, 'add-job-block')]`)));
  });
}