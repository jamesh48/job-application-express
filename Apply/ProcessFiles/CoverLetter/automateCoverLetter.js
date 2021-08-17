const {
  ApplyButtonStr,
  GenerateCoverLetterFormStr,
  GenerateCoverLetterConfirmationFormStr
} = require('./CoverLetterUtils/htmlInjectionScripts.js');

const { parseFunction, getJobAndCompanyName, generateRelevantSkillsObj, handleSkills, handleNewSkill, removeMatchingSkillSetButtons, templateFormStrings } = require('./CoverLetterUtils/coverLetterUtils.js');


const paths = require('./CoverLetterUtils/coverLetterPaths.js');

const { handleSelectorFunc, pathToJobTitle, pathToCompanyNameSpan, pathToCompanyNameLink, jobDescriptionTextPath } = paths;

const coverLetterFormData = require('./CoverLetterUtils/coverLetterFormData.js');
const coverLetterTemplate = require('./CoverLetterUtils/coverLetterTemplate.js');

module.exports = async function (driver) {
  // This Script Injects Automate Indeed Buttons on each list container, as well as relevant skills on each click.
  await driver.executeAsyncScript(
    `
    const callback = arguments[arguments.length - 1];
    await ${ApplyButtonStr}(
      ${handleSkills},
      ${JSON.stringify(paths)},
      ${String(handleSelectorFunc)}
    );
    callback('ok')
    `
  );

  // await driver.quit();


  // Gets the job and company name from the highlighted list container. (obj)
  const demographicObj = await getJobAndCompanyName(driver, pathToJobTitle.name, pathToCompanyNameSpan.name, pathToCompanyNameLink.name);

  const relevantSkillsObj = await generateRelevantSkillsObj(driver, jobDescriptionTextPath.name);

  const resultObj = await driver.executeAsyncScript(
    `
    const callback = arguments[arguments.length - 1];
    try {
    const finished = await ${GenerateCoverLetterFormStr}(

      ${JSON.stringify(coverLetterFormData)},

      ${JSON.stringify(demographicObj)},

      ${JSON.stringify(relevantSkillsObj)},

      ${String(handleSelectorFunc)},

      ${String(removeMatchingSkillSetButtons)},

      ${JSON.stringify(paths)},

      ${handleNewSkill},

      ${JSON.stringify(templateFormStrings)},

      ${String(parseFunction)}
      );

      // Returns data needed to create cover letter
      callback(finished);
    } catch(err) {
      console.log(err);
    }
    `
  );
  const coverLetterTemplated = coverLetterTemplate(resultObj);


  const finalCoverLetter = await driver.executeAsyncScript(
    `
    const callback = arguments[arguments.length - 1];
    try {
      const finalCoverLetterFromClient = await ${GenerateCoverLetterConfirmationFormStr}(${JSON.stringify(coverLetterTemplated)}
      );
      callback(finalCoverLetterFromClient);
    } catch (err) {
      console.log(err);
    }
    `
  );

  return finalCoverLetter;
}