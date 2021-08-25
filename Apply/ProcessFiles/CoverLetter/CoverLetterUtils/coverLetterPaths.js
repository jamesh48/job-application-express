module.exports = {
  handleSelectorFunc: ({ selector, selectorName, name }, iframe) => {

    if (selector === 'iframeClass') {
      return iframe.contentWindow.document.querySelector(selectorName);
    }

    if (selector === 'iframeClassAll') {
      return iframe.contentWindow.document.querySelectorAll(selectorName);
    }

    if (selector === 'id') {
      return document.getElementById(name);
    }

    if (selector === 'classQueryAll') {
      return document.querySelectorAll(selectorName);
    }

    if (selector === 'classQuery') {
      return document.querySelector(selectorName);
    }
  },

  // ids
  iframePath: {
    selector: 'id',
    name: "vjs-container-iframe",
  },
  applyButtonContainerPath: {
    selector: 'id',
    name: 'applyButtonContainer',
    custom: true
  },
  attachCoverLetterFormContainer: {
    selector: "id",
    name: 'MosaicProviderRichSearchDaemon',
  },
  // classNames
  jobDescriptionTextPath: {
    selector: 'class',
    name: 'jobsearch-jobDescriptionText'
  },
  listContainersPath: {
    selector: 'classQueryAll',
    selectorName: '.slider_item',
    name: 'slider_item',
  },
  relevantSkillsTeaserPath: {
    selector: 'iframeClassAll',
    selectorName: '.relevantSkillsTeaser',
    name: 'relevantSkillsTeaser'
  },
  viewJobButtonsContainerPath: {
    selector: 'iframeClass',
    selectorName: '.jobsearch-JobComponent-embeddedHeader',
    name: 'jobsearch-JobComponent-embeddedHeader',
  },
  // xpaths
  pathToJobTitle: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//h2[contains(@class, 'jobTitle')]//span[not(contains(., 'new'))]`
  },
  pathToCompanyNameSpan: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//span[contains(@class, 'companyName')]`
  },
  pathToAdvertisedSalary: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//span[contains(@class, 'salary')]`
  },
  pathToJobLocation: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//div[contains(@class, 'companyLocation')]`
  },
  pathToRemoteIndication: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//div[contains(@class, 'companyLocation')]//*[contains(., 'Remote')]`
  },
  pathToCompanyNameLink: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]//span[contains(@class, 'companyName')]//a`
  },
  pathToPostURL: {
    selector: 'xpath',
    name: `//*[contains(@class, 'vjs-highlight')]`
  },
  // Ids for second injection function
  coverLetterParentPath: {
    selector: 'id',
    name: 'MosaicProviderRichSearchDaemon'
  },
  techSkillsInputOnePath: {
    selector: 'id',
    name: 'techSkillsInputOne'
  },
  techSkillsButtonsOnePath: {
    selector: 'classQueryAll',
    selectorName: '.techSkillsButtonsOne',
    name: 'techSkillsButtonsOne'
  },
  techSkillsInputTwoPath: {
    selector: 'id',
    name: 'techSkillsInputTwo'
  },
  techSkillsButtonsTwoPath: {
    selector: 'classQueryAll',
    selectorName: '.techSkillsButtonsTwo',
    name: 'techSkillsButtonsTwo'
  }
}