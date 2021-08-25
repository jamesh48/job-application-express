require('dotenv').config({ path: '../.env' });
const { exec } = require("child_process");
const { By, Key, until, WebDriver } = require('selenium-webdriver');
const { openIndeed, buildDriver, filterJobPostings } = require('./RootUtils/rootConfigUtils.js');

var robot = require("robotjs");
const fs = require('fs').promises;
const generateCoverLetter = require('./ProcessFiles/CoverLetter/automateCoverLetter.js');
const { postJobApp } = require('./ProcessFiles/PostJobInfo/postJobApp.js');

const automateSurvey = require('./ProcessFiles/QualificationSurvey/automateQualificationSurvey.js');

module.exports = async () => {
  const driver = buildDriver();
  await openIndeed(driver);
  await filterJobPostings(driver);

  const [jobInfoObj, coverLetter] = await generateCoverLetter(driver);

  await fs.writeFile('resume.json',
    `{
    "basics": {
      "name": "${process.env.FULLNAME}",
      "email": "${process.env.EMAIL}",
      "phone": "${process.env.PHONENUMBER}",
      "coverLetter": ${JSON.stringify(coverLetter)},
      "location": {
        "city": "${process.env.CITY}",
        "countryCode": "${process.env.COUNTRYCODE}",
        "region": "${process.env.REGION}"
      }
    }
  }`
  );

  await postJobApp(jobInfoObj);

  exec("resume export coverLetter.pdf --format pdf --theme actual-letter")
  await automateSurvey(driver, coverLetter, []);
}