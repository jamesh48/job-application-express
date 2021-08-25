const { By, Key, until, WebDriver } = require('selenium-webdriver');
const { continueApp, openIndeed, enterBasicInfo, enterResume, enterQuestions, enterCoverLetter } = require('./QualificationSurveyUtils/qualificationSurveyUtils.js');

module.exports = async function (driver, coverLetter, alreadyEnteredArray) {

  const pageWaiter = async (driver, alreadyEnteredArray) => {
    // Wait Until a page shows...
    const pageResult = await driver.wait(async () => {

      const basicInfoTest = await driver.findElements(By.className('ia-ContactInfo'));
      if (basicInfoTest.length && alreadyEnteredArray.indexOf('basicInfo') === -1) {
        return 'basicInfo';
      };

      const resumeTest = await driver.findElements(By.className('ia-Resume'));
      if (resumeTest.length && alreadyEnteredArray.indexOf('resumeEntry') === -1) {
        return 'resumeEntry';
      };

      const questionTest = await driver.findElements(By.className('ia-Questions'));
      if (questionTest.length && alreadyEnteredArray.indexOf('questionEntry') === -1) {
        return 'questionEntry';
      };

      const relevantExperienceTest = await driver.findElements(By.className('ia-WorkExperience'));
      if (relevantExperienceTest.length && alreadyEnteredArray.indexOf('relevantExperience') === -1) {
        return 'relevantExperience';
      };

      const coverLetterTest = await driver.findElements(By.className('ia-SupportingDocuments'));

      if (coverLetterTest.length && alreadyEnteredArray.indexOf('coverLetterEntry') === -1) {
        return 'coverLetterEntry';
      };

      const reviewApplicationTest = await driver.findElements(By.className('ia-Review'));

      if (reviewApplicationTest.length && alreadyEnteredArray.indexOf('reviewSubmission') === -1) {
        return 'reviewSubmission';
      };
    });
    return pageResult;
  };

  const pageResult = await pageWaiter(driver, alreadyEnteredArray);

  if (pageResult !== 'reviewSubmission') {
    // Push in so it isn't repeated
    alreadyEnteredArray.push(pageResult);

    if (pageResult === 'basicInfo') {
      await enterBasicInfo(driver);
      await continueApp(driver);
      module.exports(driver, coverLetter, alreadyEnteredArray);
    };

    if (pageResult === 'resumeEntry') {
      await enterResume(driver);
      await continueApp(driver);
      module.exports(driver, coverLetter, alreadyEnteredArray);
    };

    if (pageResult === 'questionEntry') {
      // Just wait for the next one...
      module.exports(driver, coverLetter, alreadyEnteredArray);
    };

    if (pageResult === 'relevantExperience') {
      await driver.sleep(1500);
      // Just continue and wait for the next one...
      await continueApp(driver);
      module.exports(driver, coverLetter, alreadyEnteredArray);
    };

    if (pageResult === 'coverLetterEntry') {
      await enterCoverLetter(driver, coverLetter);
      await continueApp(driver);
      module.exports(driver, coverLetter, alreadyEnteredArray);
    };
  } else {
    console.log('review submit')
  };
};