const { continueApp, openIndeed, enterBasicInfo, enterResume, enterCoverLetter, enterWorkExperience, enterSupportingDocs } = require('./QualificationSurveyUtils/qualificationSurveyUtils.js');

module.exports = async function (driver, coverLetter) {
  // Basic Info
  await enterBasicInfo(driver);
  await continueApp(driver);
  // Resume Section
  await enterResume(driver);
  await continueApp(driver);
  // Early Cover Letter Indication (Short Application);
  await enterCoverLetter(driver, coverLetter);
  return;
  const workExperienceEntered = await enterWorkExperience(driver);

  if (workExperienceEntered) {
    await continueApp(driver);
    await driver.sleep(2000);
  };

  // Supporting Docs
  await continueApp(driver);
  await driver.sleep(3000);

  // Submission
  await continueApp(driver);

  await driver.sleep(2500);
  await driver.quit();

}