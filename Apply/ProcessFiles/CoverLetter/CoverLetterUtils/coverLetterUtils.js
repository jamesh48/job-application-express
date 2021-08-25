const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver');
const { Promise } = require('bluebird');
module.exports = {
  parseFunction: (str) => {
    var fn_body_idx = str.indexOf('{'),
      fn_body = str.substring(fn_body_idx + 1, str.lastIndexOf('}')),
      fn_declare = str.substring(0, fn_body_idx),
      fn_params = fn_declare.substring(fn_declare.indexOf('(') + 1, fn_declare.lastIndexOf(')')),
      args = fn_params.split(',');

    args.push(fn_body);

    function Fn() {
      return Function.apply(this, args);
    };

    Fn.prototype = Function.prototype;

    return new Fn();
  },

  getJobAndCompanyName: async (driver, pathToJobTitle, pathToCompanyNameSpan, pathToCompanyNameLink, pathToAdvertisedSalary, pathToRemoteIndication, pathToPostURL, pathToJobLocation) => {

    const jobTitle = await driver.findElement(By.xpath(pathToJobTitle)).getText();

    const postURL = await driver.findElement(By.xpath(pathToPostURL)).getAttribute("href");

    let jobLocation = await driver.findElement(By.xpath(pathToJobLocation)).getText();

    let jobLocationsToRemove = await driver.findElements(By.xpath(`//*[contains(@class, 'vjs-highlight')]//div[contains(@class, 'companyLocation')]//span`));

    await Promise.each(jobLocationsToRemove, async (x) => {
      const textToRemove = await x.getText();
      jobLocation = jobLocation.replace(textToRemove, '');
    })

    const advertisedSalaryTest = await driver.findElements(By.xpath(pathToAdvertisedSalary));

    const advertisedSalary = advertisedSalaryTest.length ? await advertisedSalaryTest[0].getText() : 'Salary Not Advertised';

    const remoteTest = await driver.findElements(By.xpath(pathToRemoteIndication));
    const remote = remoteTest.length ? true : false;

    const spanTest = await driver.findElements(By.xpath(pathToCompanyNameSpan));

    if (spanTest.length) {
      const companyName = await spanTest[0].getText();
      return { jobTitle: jobTitle, companyName: companyName, advertisedSalary: advertisedSalary, postURL: postURL, jobLocation: jobLocation, jobIsRemote: remote }
    }

    const linkTest = await driver.findElements(By.xpath(pathToCompanyNameLink));

    if (linkTest.length) {
      const companyName = await linkTest[0].getText();
      return { jobTitle: jobTitle, postURL: postURL, companyName: companyName, advertisedSalary: advertisedSalary, jobLocation: jobLocation, jobIsRemote: remote };
    }

  },
  disableInitialApplyButton: async (driver) => {
    try {
      await driver.switchTo().frame(0);
      await driver.executeScript(
        `
        let firstItemIndeedApply = document.getElementById('indeedApplyButtonContainer');

        if (firstItemIndeedApply) {
          firstItemIndeedApply.style.pointerEvents = 'none';
          document.getElementById('indeedApplyButton').setAttribute('style', 'background-color: gray !important');
        };
        `
      )
      await driver.switchTo().defaultContent();
      return;
    } catch (err) {
      console.log(err);
    }
  },
  autoStartSurvey: async (driver) => {
    try {
      await driver.switchTo().frame(0);
      await driver.executeScript(
        `
        document.getElementById('indeedApplyButtonContainer').style.pointerEvents = 'initial';
        document.getElementById('indeedApplyButton').setAttribute('style', 'background-color: goldenrod !important');
        `
      )
      await driver.findElement(By.id('indeedApplyButton')).click();
      await driver.switchTo().defaultContent();
    } catch (err) {
      console.log(err);
    }
  },
  generateRelevantSkillsObj: async (driver, jobDescriptionTextPath) => {

    try {
      // Switch to the iframe
      await driver.switchTo().frame(0);

      // Get the job description...
      const jobDescription = await driver.findElement(By.className(jobDescriptionTextPath)).getText();

      // Create an object with matching skills to the job description
      const relevantSkillsObj = module.exports.handleSkills(jobDescription);

      // Switch back to parent frame
      await driver.switchTo().defaultContent();

      // Return Data
      return [jobDescription, relevantSkillsObj];
    } catch (err) {
      console.log(err);
    }

  },

  handleNewSkill: (placeholder, skill, idName, companyName) => {
    const valueTest = document.getElementById(idName).value;

    // If there is no value...
    if (valueTest === '') {
      let result = placeholder.replaceAll('(company)', companyName);
      result = result.concat(` ${skill}.`);
      document.getElementById(idName).value = result;
      return;
    }

    document.getElementById(idName).value = `${valueTest} ${skill}`
    return;

    // // If there is a value, tech buttons have already been clicked...
    // let updateSplit = valueTest.split('');
    // let commaSplitTest = valueTest.slice(placeholder.length).split(', ');
    // let andSplitTest = valueTest.slice(placeholder.length).split('and');

    // // Add an and if at least one item already exists.
    // if (commaSplitTest.length === 1 && andSplitTest.length === 1) {
    //   updateSplit.splice(updateSplit.length - 1, 1, ` and ${skill}.`);
    // } else if (commaSplitTest.length > 1 || andSplitTest.length >= 2) {
    //   // Remove the trailing period.
    //   let lastThing = andSplitTest[andSplitTest.length - 1].split('');
    //   lastThing.splice(lastThing.length - 1, 1);
    //   andSplitTest.splice(andSplitTest.length - 1, 1, lastThing.join(''));
    //   updateSplit.splice(placeholder.length, updateSplit.length - placeholder.length, andSplitTest.join(', ').concat(` and ${skill}.`));
    //   // First pass
    // } else {
    //   updateSplit.splice(updateSplit.length - 1, 1, `, ${skill}.`);
    // }
    // document.getElementById(idName).value = updateSplit.join('');
  },

  removeMatchingSkillSetButtons: (handleSelectorFunc, skillset, techSkillsButtonsOne, techSkillsButtonsTwo) => {
    // Remove the relevant buttons from both sets of buttons
    // The first (primary buttons);
    handleSelectorFunc(techSkillsButtonsOne).forEach((matchingSkillSet) => {
      if (matchingSkillSet.dataset.skillset === skillset) {
        matchingSkillSet.remove();
      }
    });

    // The secondary buttons.
    handleSelectorFunc(techSkillsButtonsTwo).forEach((matchingSkillSet) => {
      if (matchingSkillSet.dataset.skillset === skillset) {
        matchingSkillSet.remove();
      }
    });
    return;
  },

  templateFormStrings: {
    demographicInfoTemplate: String((input, companyName, jobTitle) => {
      const { classType, title, placeholder, defaultValue, orderIndex } = input;
      return (
        `
        <div>
          <input
            style="width: 100%"
            data-orderindex=${orderIndex}
            data-defaultvalue="${defaultValue}"
            data-classtype="${classType}"
            data-title="${title}"
            value="${title === 'companyName' ? companyName : defaultValue.replaceAll('(jobTitle)', jobTitle)}"
            type="text">
        </div>
        `
      );
    }),
    defaultValueTemplate: String((input, companyName, jobTitle) => {
      const { classType, title, defaultValue, orderIndex } = input;

      return (
        `<div>
              <input
                style="width: 100%"
                data-orderindex=${orderIndex}
                data-defaultvalue="${defaultValue}"
                data-classtype="${classType}"
                data-title="${title}"
                value="${defaultValue.replaceAll('(company)', companyName).replaceAll('(jobTitle)', jobTitle)}"
                type="text"
              >
          </div>`
      );
    }),

    techSkillsTemplate: String((input, relevantSkillsArr, companyName, paths) => {
      const { classType, defaultValue, title, lastOfSection, orderIndex } = input;
      const { buttonsName, inputName } = paths;

      return (`
          <div>
            <textarea
              id=${inputName}
              style="width: 100%; height: 50px;"
              data-orderindex=${orderIndex}
              data-defaultvalue="${defaultValue}"
              data-classtype="${classType}"
              data-title="${title}"
            >${defaultValue}</textarea>
            <div id='techButtonsContainer' style='display: flex; flex-direction: column'>`).concat(
        relevantSkillsArr.length ?
          Object.values(relevantSkillsArr.reduce((total, item) => {
            if (total[item.skillSet]) {
              total[item.skillSet] = [...total[item.skillSet], item];
            } else {
              total[item.skillSet] = [item];
            };
            return total;
          }, {})).map((skillSetArray) => {
            return (
              `<div style='display: flex'>`.concat(skillSetArray.map((applicableSkill, index) => {
                let nestedSpan = document.createElement('span');
                nestedSpan.style = "display: flex";
                if (applicableSkill.sentence) {
                  nestedSpan.style = `
                  display: flex;
                  padding: 0.5%;
                  background-color: rebeccapurple;
                  border: 1px solid black;
                  `;
                } else {
                  nestedSpan.style = "display: flex";
                }
                let newButton = document.createElement('button');
                newButton.type = 'button';

                if (applicableSkill.value) {
                  newButton.value = `${applicableSkill.value}`;
                  newButton.innerHTML = applicableSkill.value;
                } else {
                  newButton.value = `${applicableSkill.sentence}`;
                  newButton.innerHTML = `${applicableSkill.skillSet}`;
                  newButton.dataset.nuclear = 'true'
                };

                newButton.className = buttonsName;
                newButton.dataset.defaultValue = defaultValue;
                newButton.dataset.skillset = applicableSkill.skillSet;

                nestedSpan.appendChild(newButton);

                return nestedSpan.outerHTML;
              }).join('')
              ).concat(`</div>`)
            )
          }).join('')
          : `<span style="display: flex">No Relevant ${lastOfSection ? 'Secondary' : 'Primary'} Skills</span>`
      ).concat('</div></div>')
    }),

    placeholderTemplate: String((input, companyName) => {
      const { classType, defaultValue, title, placeholder, orderIndex } = input;

      return (
        `<div>
              <input
                style="width: 100%"
                data-orderindex=${orderIndex}
                data-defaultvalue="${defaultValue}"
                data-classtype="${classType}"
                data-title="${title}"
                placeholder="${defaultValue.replaceAll('(company)', companyName)}"
                default="${defaultValue.replaceAll('(company)', companyName)}"
                type="text"
              >
            </div>`
      );
    }),
  },
  handleSkills: (jobDescription) => {
    // Agile methodology, rest API, (github, git, version control),
    // frontend toolchain like Webpack, Babel
    // Docker
    // testing frame works.
    const skills = [
      //Front End Skills
      {
        sentence: 'building intuitive and responsive applications using modern front end frameworks like React/Redux, HTML5, SASS/SCSS/CSS3, and jQuery to boot',
        skillSet: 'Front End Skills (n)',
        skillSets: [
          {
            preferred: 'React',
            strongKeywords: [
              'react native',
              'react-native',
              'reactjs',
              'react-js',
              'react.js',
              'react',
              'jsx'
            ],
            acceptableKeywords: [
              'state management',
              'angular',
              'angular-js',
              'vue.js',
              'vue-js',
              'vuejs',
              'vue',
            ],
            weakKeywords: [],

            added: {
              preferred: 'Redux',
              mark: '/',
              keywords: [
                'redux',
                'complex state management',
              ]
            }
          },
          {
            preferred: 'HTML5',
            strongKeywords: [
              'html5',
              'html',
            ],
            acceptableKeywords: [],
            weakKeywords: [],
          },
          {
            preferred: 'CSS3',
            strongKeywords: [
              'css3',
              'css'
            ],
            acceptableKeywords: [],
            weakKeywords: [],
          },
          {
            preferred: 'Javascript es6',
            strongKeywords: [
              'ecmascript',
              'ecma script',
              'javascript es6',
              'js es6',
              'es6',
              'ecma-script2015',
              'ecmascript2015',
              'es5',
              'es2015',
              'js',

            ],
            acceptableKeywords: [
              'object-oriented programming',
              'object oriented programming language',
              'object oriented programming languages',
              'object oriented programming',
              'oop',
              'object oriented design',
              'object-oriented',
              'object oriented',
            ],
            weakKeywords: [
              'typescript',
              'dom manipulation',
              'native dom',
              'dom',
            ]
          },
          {
            preferred: 'jQuery',
            strongKeywords: [
              'jquery',
              'j-query'
            ],
            acceptableKeywords: [
              'ajax'
            ],
            weakKeywords: []
          },
          {
            preferred: 'SASS/SCSS',
            strongKeywords: [
              'sass/scss',
              'scss/sass',
              'scss',
              'sass'
            ],
            acceptableKeywords: [
              'mobile-first design',
              'mobile first design',
              ' ui/ux ',
              ' ui ',
              ' ux ',
              'user experience',
              'responsive web design',
              'responsive-webdesign',
              'responsive design',
              'media queries',
              'media query',
            ],
            weakKeywords: [
              'intuitive',
              'interface',
              'ui'
            ]
          },
        ]
      },
      // Backend Skils
      {
        sentence: 'backend server frameworks like Express and Node',
        skillSet: 'Backend Skills (n)',
        skillSets: [
          {
            preferred: 'Express',
            strongKeywords: [
              'express router',
              'express-server',
              ' express ',
              '-express ',
              ' express-'
            ],
            acceptableKeywords: [
              'backend server',
              'server',
              'middleware',
              'backend',
              'back-end',
              'back end',
            ],
            weakKeywords: []
          },

          {
            preferred: 'Node',
            strongKeywords: [
              'node.js',
              'nodejs',
              ' node ',
              '-node ',
              ' node-',
              'node ',
              ' node'
            ],
            acceptableKeywords: [
              ' fs',
              'file system',
              'filesystem',
              'file-system',
            ],
            weakKeywords: [],
          },
          {
            preferred: 'NGINX',
            strongKeywords: [
              'nginx',
              'njs scripting language',
              ' njs ',
              ' njs',
            ],
            acceptableKeywords: [
              'horizontal system design architecture',
              'reverse proxy',
              'system design architecture',
              'backend optimization',
              'back-end optimization',
              'load balancer',
              'load balancing',
              'load-balancing',
              'http caching',
              'http cache',
              'caching',
              'cache',
              'scaled',
              'scalable',
              'scaling',
            ],
            weakKeywords: [
              'architecture',
              'system flow',
              'system-flow',
              'scale',
              'system architects',
              'technical architects',
            ]
          },
        ]
      },
      // Database Skill Sets
      {
        sentence: 'relational database technologies such as postgreSQL, mySQL and Sequelize',
        skillSet: 'Relational Databases (n)',
        skillSets: [
          // Postgres
          {

            preferred: 'postgreSQL',
            strongKeywords: [
              'postgres',
              'postgresql',
            ],
            acceptableKeywords: [
              ' pg ',
            ],
            weakKeywords: [
              'pg'
            ],
            added: {
              'mark': '/',
              preferred: 'Sequelize',
              keywords: [
                'sequelize',
                'database query optimization',
                'database optimization',
                ' orm ',
                ' orms ',
                ' orm-',
                '-orm ',
                ' orms-',
                'object-relational mapping',
                'object relational mapping',
                'object relationship mapping',
                'object-relationship mapping',
              ],
            },
          },

          {
            preferred: 'mySQL',
            strongKeywords: [
              ' mysql ',
              'mysql ',
              'mysql',
              'mysqllite',
              'mysql-lite',
              'mysql lite',
            ],
            acceptableKeywords: [
              ' dbs ',
              ' db ',
              ' db',
              'db ',
              '-db ',
              ' db-',
              'databases',
              'database',
            ],
            weakKeywords: [
              'storage',
              'db',
            ],
            added: {
              preferred: 'Sequelize',
              'mark': '/',
              keywords: [
                'sequelize',
                'database query optimization',
                'database optimization',
                ' orm ',
                ' orms ',
                ' orm-',
                '-orm ',
                ' orms-',
                'object-relational mapping',
                'object relational mapping',
                'object relationship mapping',
                'object-relationship mapping',
              ],
            },
          },

          {
            preferred: 'Relational Database technologies',
            strongKeywords: [
              'relational database technologies',
              'relational database technology',
              'relational databases',
              'relational database',
            ],
            acceptableKeywords: [
              ' dbs ',
              ' db ',
              ' db',
              'db ',
              '-db ',
              ' db-',
              'databases',
              'database',
            ],
            weakKeywords: [
              'storage',
              'db',
            ]
          },
        ],
      },
      {
        preferred: 'Mongo',
        strongKeywords: [
          'mongodb',
          'mongo',
        ],
        acceptableKeywords: [
          ' db ',
          'databases',
          'database'
        ],
        weakKeywords: [],
        added: {
          'mark': '/',
          'preferred': 'Mongoose',
          keywords: [
            'mongoose',
            'orm',
            'object-relational mapping',
            'object relational mapping',
            'object relationship mapping',
            'object-relationship mapping',
          ],
        },
      },
      // Tools
      {
        sentence: 'deploying scalable, and optimized architecture using Amazon Web Services, NGINX, and PM2',
        skillSet: 'Deployment Tech (n)',
        skillSets: [
          // Amazon Web-Services
          {
            preferred: 'Amazon Web Services (AWS)',
            strongKeywords: [
              'amazon web services',
              'amazon web-services',
              'amazon webservices',
              'aws',
            ],
            acceptableKeywords: [
              'microservices',
              'micro-services',
              'microservice',
              'micro-service',
              'deployment',
              'deployed',
              'deploy'
            ],
            weakKeywords: [
              'production',
            ],
            added: {
              mark: '- ',
              preferred: 'EC2 & S3',
              keywords: [
                'ec2',
                's3',
              ],
            },
          },
          {
            preferred: 'PM2',
            strongKeywords: [
              ' pm2 ',
              'process management',
            ],
            acceptableKeywords: [
              'server persistence',
            ],
            weakKeywords: [
              'persistence'
            ]
          },
          // Google Cloud Platform
          {
            preferred: 'Google Cloud Platform',
            strongKeywords: [
              'google cloud platform',
              'gcp',
            ],
            acceptableKeywords: [
              'google cloud',
            ],
            weakKeywords: [
              'deploy'
            ]
          },
        ]
      },

      {
        sentence: 'thorough understanding and appreciation for modern industry paradigms such as MVC, Agile Methodology, Github Version Control, the importance of iterative development, and collaborative synergy',
        skillSet: 'Paradigms (n)',
        skillSets: [
          {
            preferred: 'MVC Frameworks',
            strongKeywords: [
              'mvc frameworks',
              'mvc framework',
              'model view controller',
              'model-view-controller',
              'model/view/controller',
              'mvc',
            ],
            acceptableKeywords: [],
            weakKeywords: [],
          },
          // Agile Methodology
          {
            preferred: 'Agile Methodology',
            strongKeywords: [
              'agile methodology',
              'agile methodologies',
              'agile',
            ],
            acceptableKeywords: [
              'standups',
              'stand-ups',
              'standup',
              'trello',
              'jira',
              'software development life cycle',
              'ticketing systems',
              'ticketing system',
              'ticketing',
              'iterative development',
              'iterative',
            ],
            weakKeywords: [
              'project manager',
              ' pm ',
              'start-up',
              'start up',
            ]
          },
          {
            preferred: 'Github Version Control',
            strongKeywords: [
              'git workflow',
              ' git ',
              'github',
            ],
            acceptableKeywords: [
              'version control tools',
              'version control tool',
              'version control',
              'source control',
              'repositories',
              'repository',
              'pull request',
              'pull requests',
            ],
            weakKeywords: []
          },
        ],
      },
      // testing
      {
        sentence: 'test driven development, and can write good tests using Mocha/Chai, React Testing Library, Jest/Enzyme, and Selenium',
        skillSet: 'Testing (n)',
        skillSets: [
          {
            preferred: 'Mocha/Chai & Sinon Spy',
            strongKeywords: [
              ' mocha ',
              ' chai ',
              'mocha/chai',
            ],
            acceptableKeywords: [
              'tdd',
              'unit testing',
              'test-driven development',
              'test driven development',
              'test-driven-development',
            ],
            weakKeywords: [
              'software quality assurance',
              'quality assurance'
            ]
          },
          {
            preferred: 'React Testing Library',
            strongKeywords: [
              'react testing library',
              'react testing',
            ],
            acceptableKeywords: [
              'tdd',
              'test-driven development',
              'test driven development',
              'test-driven-development',
            ],
            weakKeywords: [
              'software quality assurance',
              'quality assurance'
            ]
          },
          {
            preferred: 'Jest',
            strongKeywords: [
              ' jest ',
              ' jest',
            ],
            acceptableKeywords: [
              'tdd',
              'test-driven development',
              'test driven development',
              'test-driven-development',
              'unit testing',
              'front-end testing frameworks',
              'front end testing frameworks',
              'front-end testing framework',
              'front end testing framework',
              'front-end testing',
              'front-end testing',
              'software quality assurance',
              'quality assurance',
              'test code',
              ' test ',
            ],
            weakKeywords: [
              'testing',
              'test',
            ],
            added: {
              preferred: 'Enzyme',
              mark: '/',
              keywords: [
                'Enzyme',
              ]
            },
          },
          {
            preferred: 'Selenium',
            strongKeywords: [
              'selenium-webdriver',
              'selenium web driver',
              'selenium webdriver',
              'selenium js',
              'selenium',
            ],
            acceptableKeywords: [
              'integration testing',
              'rest api testing',
              'api testing',
              'automated test',
              'automated testing',
              'automation tools',
              'cross-browser testing',
              'cross browser testing',
              'cross-browser tests',
              'cross browser tests',
              'cross-browser test',
              'cross browser test',
            ],
            weakKeywords: [
              'cross-browser',
              'cross browser',
              'web driver',
              'webdriver',
            ]
          },
        ]
      },
    ];


    let jobDescriptionLower = jobDescription.toLowerCase();
    let resultArr = [];
    let strongResultArr = [];
    let acceptableResultArr = [];

    for (let i = 0; i < skills.length; i++) {
      // If there is a sentence there is a skillset...
      if (skills[i].sentence) {
        let skillFoundInSkillSet = false;

        loopSkillSet: for (let x = 0; x < skills[i].skillSets.length; x++) {
          const preferredItem = skills[i].skillSets[x].preferred;

          const nuclearItem = {
            sentence: skills[i].sentence,
            skillSet: skills[i].skillSet,
          }


          // Nested search for different ways of saying a technology
          loopStrong: for (let j = 0; j < skills[i].skillSets[x].strongKeywords.length; j++) {
            const strongTestItem = skills[i].skillSets[x].strongKeywords[j];
            const nestedStrongTest = jobDescriptionLower.indexOf(strongTestItem);

            if (nestedStrongTest > -1) {
              // push in the nuclear option once.
              if (!skillFoundInSkillSet) {
                skillFoundInSkillSet = true;
                strongResultArr.push(nuclearItem);
              };

              const strongItem = {
                value: preferredItem,
                skillSet: skills[i].skillSet,
              }

              strongResultArr.push(strongItem);
              break loopStrong;
            }
          }

          loopAcceptable: for (let j = 0; j < skills[i].skillSets[x].acceptableKeywords.length; j++) {

            const acceptableTestItem = skills[i].skillSets[x].acceptableKeywords[j];
            const nestedTest = jobDescriptionLower.indexOf(acceptableTestItem);

            if (nestedTest > -1) {
              // push in the nuclear option once.
              if (!skillFoundInSkillSet) {
                skillFoundInSkillSet = true;
                acceptableResultArr.push(nuclearItem);
              };

              const acceptableItem = {
                value: preferredItem,
                skillSet: skills[i].skillSet,
              }

              acceptableResultArr.push(acceptableItem);
              break loopAcceptable;
            }
          }
        }
      };
    };

    let resultObj = {
      strong: strongResultArr,
      acceptable: acceptableResultArr,
    }
    return resultObj;
  },

}