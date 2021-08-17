module.exports = {
  ApplyButtonStr: String(function (handleSkills,
    {
      listContainersPath,
      applyButtonContainerPath,
      relevantSkillsTeaserPath,
      iframePath,
      viewJobButtonsContainerPath,
    },
    handleSelectorFunc
  ) {
    return new Promise((resolve, reject) => {
      const listContainers = handleSelectorFunc(listContainersPath);

      listContainers.forEach((container, index) => {
        container.addEventListener('click', (event) => {
          event.preventDefault();
          // When a container is clicked on, first remove the apply button from the previous container;
          if (handleSelectorFunc(applyButtonContainerPath)) {
            handleSelectorFunc(applyButtonContainerPath).remove();
          }


          // Adds Container of Relevant Skills to Prospective Job Application
          setTimeout(() => {

            const generateRelevantSkillContainer = (iframe, jobDescription, containerColor) => {
              let newElement = iframe.contentWindow.document.createElement('div');
              newElement.style = 'display: -webkit-box; overflow: scroll';
              newElement.className = relevantSkillsTeaserPath.name,

                newElement.innerHTML = jobDescription.map((relevantSkill) => {
                  return !relevantSkill.sentence ? (
                    `<span
                  class='relevantSkills'
                  style="
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 border: 1px solid black;
                 padding: 2% 5%;
                 background-color: ${containerColor};
                ">
                ${relevantSkill.value}
                </span>
                `) : null;
                }).join('');

              return newElement;
            };

            const iframe = handleSelectorFunc(iframePath);

            const jobDescription = handleSkills(iframe.contentWindow.document.getElementById("jobDescriptionText").textContent);

            const strongContainer = generateRelevantSkillContainer(iframe, jobDescription.strong, 'goldenrod');

            const acceptableContainer = generateRelevantSkillContainer(iframe, jobDescription.acceptable, 'silver');

            const viewJobButtonsContainer = handleSelectorFunc(viewJobButtonsContainerPath, iframe);

            viewJobButtonsContainer.appendChild(strongContainer);
            viewJobButtonsContainer.appendChild(acceptableContainer);
          }, 1500);

          let applyButtonHanger = document.createElement('div');
          applyButtonHanger.id = applyButtonContainerPath.name;

          applyButtonHanger.innerHTML = `
            <button class='automateIndeedButton' style="height: 30px; width: 100%; margin: 0 auto; background-color: darkblue; color: ivory">Automate Indeed</button>
          `;

          applyButtonHanger.addEventListener('click', (event) => {
            event.preventDefault();
            // This makes the relevantSkillsTeaser disappear and then it reappears...
            const iframe = handleSelectorFunc(iframePath);
            const relevantSkillsTeaserCollection = handleSelectorFunc(relevantSkillsTeaserPath, iframe);
            relevantSkillsTeaserCollection.forEach((x) =>
              x.remove()
            );

            applyButtonHanger.remove();
            resolve();
          });

          container.appendChild(applyButtonHanger);
        });
      })
    });
  }),


  GenerateCoverLetterFormStr: String(function (
    coverLetterFormData,
    { jobTitle, companyName },
    relevantSkillsObj,
    handleSelectorFunc,
    removeMatchingSkillSetButtons,
    { coverLetterParentPath, techSkillsInputOnePath, techSkillsButtonsOnePath, techSkillsInputTwoPath, techSkillsButtonsTwoPath },
    handleNewSkill,
    { demographicInfoTemplate, techSkillsTemplate, defaultValueTemplate, placeholderTemplate },
    parseFunction
  ) {
    return new Promise((resolve, reject) => {
      let coverLetterInputForm = document.createElement('div');

      coverLetterInputForm.innerHTML =
        `<form style="width: 75vw" id='coverLetterForm'>`.concat(
          coverLetterFormData.map((input) => {
            const { classType, lastOfSection, defaultValue } = input;
            // Company and Job Title
            if (classType === 'demographicInfo') {
              return parseFunction(demographicInfoTemplate)(input, companyName, jobTitle);
            }
            // Tech Skills, return buttons...
            if (classType === 'techSkills') {
              const pathObj = {
                buttonsName: !lastOfSection ? techSkillsButtonsOnePath.name : techSkillsButtonsTwoPath.name,
                inputName: !lastOfSection ? techSkillsInputOnePath.name : techSkillsInputTwoPath.name
              };

              const skillArr = !lastOfSection ? relevantSkillsObj.strong : relevantSkillsObj.acceptable;

              return parseFunction(techSkillsTemplate)(input, skillArr, companyName, pathObj);
            }

            // If there is a default value, it means that the text is hard coded.
            if (defaultValue) {
              return parseFunction(defaultValueTemplate)(input, companyName, jobTitle);
            };
            // Otherwise return with the suitable placeholder...
            return parseFunction(placeholderTemplate)(input, companyName)
          }).join('')
        ).concat(`<button style="width: 10%" type="submit">Ok</button></form>`);

      const coverLetterParent = handleSelectorFunc(coverLetterParentPath);
      coverLetterParent.appendChild(coverLetterInputForm);

      // Adding event listeners after the fact...
      // techSkillsButtons (first set)
      handleSelectorFunc(techSkillsButtonsOnePath).forEach((relevantTechButton) => {
        relevantTechButton.addEventListener('click', (
          { target: { value: skill, dataset: { nuclear, skillset, defaultvalue: defaultValue } } }
        ) => {
          if (skillset && nuclear) {
            removeMatchingSkillSetButtons(handleSelectorFunc, skillset, techSkillsButtonsOnePath, techSkillsButtonsTwoPath);
          }

          handleNewSkill(
            defaultValue,
            skill,
            techSkillsInputOnePath.name,
            companyName
          );
        });
      });

      // techSkillsButtons (second set)
      handleSelectorFunc(techSkillsButtonsTwoPath).forEach((relevantTechButton) => {
        relevantTechButton.addEventListener('click', (
          { target: { value: skill, dataset: { nuclear, skillset, defaultvalue: defaultValue } } }
        ) => {

          if (skillset && nuclear) {
            removeMatchingSkillSetButtons(handleSelectorFunc, skillset, techSkillsButtonsOnePath, techSkillsButtonsTwoPath);
          }

          handleNewSkill(
            defaultValue,
            skill,
            techSkillsInputTwoPath.name
          );
        });
      });

      // When the form is submitted, remove it and gather the data...
      coverLetterInputForm.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();

        const allInputEntries = coverLetterInputForm.querySelectorAll('input');
        const allTextAreaEntries = coverLetterInputForm.querySelectorAll('textarea');

        let coverLetterDataObj = {};

        // For Inputs...
        for (let i = 0; i < allInputEntries.length; i++) {
          const { value, dataset: { defaultvalue: defaultValue, classtype, title, orderindex: orderIndex } } = allInputEntries[i];

          // if (classtype === 'demographicInfo') {
          //   coverLetterDataObj[title] = { orderIndex: orderIndex, value: value, defaultValue: defaultValue };
          // } else {
            // If it doesn't exist...
            if (!coverLetterDataObj[classtype]) {
              coverLetterDataObj[classtype] = {
                orderIndex: orderIndex,
                data: [
                  { title: title, value: value, defaultValue: defaultValue }
                ],
              }
            } else {
              // Otherwise Add to The pile
              coverLetterDataObj[classtype] = {
                orderIndex: orderIndex,
                data: [...coverLetterDataObj[classtype]['data'], { title: title, value: value, defaultValue: defaultValue }]
              }
            // }
          }
          allInputEntries[i].disabled = true;
        };

        // And Text areas....
        for (let i = 0; i < allTextAreaEntries.length; i++) {
          const { value, dataset: { defaultvalue: defaultValue, classtype, title, orderindex: orderIndex } } = allTextAreaEntries[i];
          // If it doesn't exist...
          if (!coverLetterDataObj[classtype]) {
            coverLetterDataObj[classtype] = {
              orderIndex: orderIndex,
              data: [
                { title: title, value: value, defaultValue: defaultValue }
              ]
            }
          } else {
            // Otherwise Add to The pile
            coverLetterDataObj[classtype] = {
              orderIndex: orderIndex,
              data: [...coverLetterDataObj[classtype]['data'], { title: title, value: value, defaultValue: defaultValue }],
            }
          }
          allTextAreaEntries[i].disabled = true;
        };

        resolve(coverLetterDataObj);
      });
    });
  }),
  GenerateCoverLetterConfirmationFormStr: String(function (coverLetterTemplated) {

    return new Promise((resolve, reject) => {
      const coverLetterForm = document.getElementById('coverLetterForm');

      const confirmationFormInputs = document.createElement('div');
      confirmationFormInputs.innerHTML = `
      <form>
        <textarea rows="13" cols="125" style='width: 100%'>${coverLetterTemplated}</textarea>
        <div>
          <button style="width: 100%" type="submit">Confirm Cover Letter</button></form>
        </div>
      </form>
      `;

      coverLetterForm.appendChild(confirmationFormInputs);

      coverLetterForm.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const confirmedCoverLetter = coverLetterForm.querySelector('form').querySelector('textarea').value;

        coverLetterForm.remove();
        resolve(confirmedCoverLetter)
      })
    })
  }),
}