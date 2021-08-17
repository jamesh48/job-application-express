require('dotenv').config({path: '../.env'});

const { openIndeed, buildDriver, filterJobPostings } = require('./RootUtils/rootConfigUtils.js');

const fs = require('fs').promises;
const generateCoverLetter = require('./ProcessFiles/CoverLetter/automateCoverLetter.js');
const automateSurvey = require('./ProcessFiles/QualificationSurvey/automateQualificationSurvey.js');

(async function automateIndeed() {
  const driver = buildDriver();
  await openIndeed(driver);
  filterJobPostings(driver);
  const coverLetter = await generateCoverLetter(driver);
  await fs.writeFile('backupCoverLetter.txt', coverLetter);
  await automateSurvey(driver, coverLetter);
})();