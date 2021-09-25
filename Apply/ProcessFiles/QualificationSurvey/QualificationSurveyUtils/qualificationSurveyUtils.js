const { keyTap, typeString } = require("robotjs");
const { By, Key } = require('selenium-webdriver');
const { firstName, lastName, phoneNumber } = require('./surveyConfig.js');


module.exports = {
  continueApp: async (driver) => {
    try {
      await driver.findElement(By.className('ia-continueButton')).click();
    } catch (err) {
      console.log(err);
    };
  },
  enterBasicInfo: async (driver) => {
    try {
      await driver.findElement(By.tagName('input')).sendKeys(firstName.toString(), Key.TAB, lastName.toString(), Key.TAB, phoneNumber.toString());
    } catch (err) {
      console.log(err);
    };
  },
  setWrittenCoverLetter: async (driver, coverLetter) => {
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
            })('#coverletter-textarea', ${JSON.stringify(coverLetter)});
            `
      );
    } catch (err) {
      console.log('execute cover letter entry script error-> ')
      console.log(err);
    }
  },
  automatePDFUpload: async (driver) => {
    await driver.sleep(1500);
    keyTap('2', 'command');
    await driver.sleep(500);
    keyTap('tab');
    typeString('coverLetter.pdf');
    await driver.sleep(750);
    keyTap('down');
    keyTap('enter');
    await driver.sleep(750);
    keyTap('tab');
    keyTap('tab');
    keyTap('down');
    keyTap('c');
    keyTap('enter');
    return;
  },
  enterResume: async (driver) => {
    try {
      await driver.findElement(By.className('ia-SmartApplyCard')).click();
      await driver.sleep(1000);
    } catch (err) {
      console.log(err);
    }
  },
  enterCoverLetter: async (driver, coverLetter) => {
    // Wait until either the PDF submission or write cover letter form is shown...
    const strFlag = await driver.wait(async () => {

      const pdfSubmitTest = await driver.findElements(By.xpath(`//div[contains(@class, 'file-question-upload-button')]//div[contains(@class, 'ia-SmartApplyCard-headerButton')]`));

      const writeCoverLetterTest = await driver.findElements(By.xpath(`//*[contains(@id, 'write-cover-letter-selection-card')]//div//span`));


      // PDF comes first...
      if (pdfSubmitTest.length) {
        return 'pdf';
      };

      if (writeCoverLetterTest.length) {
        return 'write';
      };
    });


    if (strFlag === 'pdf') {
      console.log('pdf');
      try {
        await driver.findElement(By.xpath(`//div[contains(@class, 'file-question-upload-button')]//div[contains(@class, 'ia-SmartApplyCard-headerButton')]`)).click();
        await module.exports.automatePDFUpload(driver);
      } catch (err) {
        console.log(err);
      }
    }

    if (strFlag === 'write') {
      console.log('write');
      try {
        await driver.findElement(By.xpath(`//*[contains(@id, 'write-cover-letter-selection-card')]//div//span`)).click();
        await module.exports.setWrittenCoverLetter(driver, coverLetter);
      } catch (err) {
        console.log(err);
      };
    };
  },
};

