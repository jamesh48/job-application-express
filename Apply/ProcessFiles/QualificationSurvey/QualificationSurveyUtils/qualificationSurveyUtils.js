const { By, Key, until } = require('selenium-webdriver');
const { firstName, lastName, phoneNumber, location, recentJobTitle, recentJobWork } = require('./surveyConfig.js');

module.exports = {
  continueApp: async (driver) => {
    await driver.findElement(By.className('ia-continueButton')).click();
  },
  enterBasicInfo: async (driver) => {
    await driver.wait(until.elementLocated(By.className('ia-BasePage-heading')));
    // Basic Info->
    await driver.findElement(By.tagName('input')).sendKeys(firstName.toString(), Key.TAB, lastName.toString(), Key.TAB, phoneNumber.toString());

    let locationTest = await driver.findElements(By.id('input-location'));
    if (locationTest.length > 0) {
      await driver.findElement(By.id('input-location')).sendKeys(location.toString());
    }
  },
  enterResume: async (driver) => {
    await driver.wait(until.elementLocated(By.className('ia-SmartApplyCard')));
    await driver.findElement(By.className('ia-SmartApplyCard')).click();
    await driver.sleep(1000);
  },
  enterCoverLetter: async (driver, coverLetter) => {
    await driver.sleep(1500);

    let coverLetterTest = await driver.findElements(By.id('cover-letter-label'));

    if (coverLetterTest.length > 0) {
      await driver.findElement(By.xpath(`//*[contains(@id, 'write-cover-letter-selection-card')]//div//span`)).click();

      try {
        await driver.executeScript(
          `
            ((selector, value) => {
              const el = document.querySelector(selector);
              if (el) {
                el.focus();
                el.select();
                if (!document.execCommand('insertText', false, value)) {
                  // Fallback for Firefox: just replace the value
                  el.value = 'new text';
                }
                //This is not usually needed.
                el.dispatchEvent(new Event('change', { bubbles: true }));
              }
              return el;
            })('#coverletter-textarea', ${JSON.stringify(coverLetter)})
            `
        );
      } catch (err) {
        console.log(err);
      }
      return;
    }
  },

  enterSupportingDocs: async (driver) => {
    await driver.findElement(By.className('ia-continueButton')).click();
  },

  enterWorkExperience: async (driver) => {
    await driver.wait(async () => {
      let testOne = await driver.findElements(By.className('ia-WorkExperience'));
      let testTwo = await driver.findElements(By.className('ia-SupportingDocuments'));

      return (testOne.length || testTwo.length);
    });

    const workExperienceTest = await driver.findElements(By.className('ia-WorkExperience'));

    if (workExperienceTest.length) {
      await driver.findElement(By.tagName('input')).sendKeys(recentJobTitle.toString(), Key.TAB, recentJobWork.toString());
      return true;
    }
  },
}

