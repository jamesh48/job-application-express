module.exports = [
  {
    title: 'companyName',
    classType: 'demographicInfo',
    lastOfSection: false,
    orderIndex: 0,
  },
  {
    title: 'availableJobTitle',
    defaultValue: 'I wanted to express an interest in the open (jobTitle) position',
    classType: 'demographicInfo',
    lastOfSection: true,
    orderIndex: 0,
  },
  {
    title: 'interestedBecauseOne',
    defaultValue: `${"I am very interested in working with (company) because I am passionate about creating software that enriches the life of others and I see that (company) is dedicated to this mission as well"}`,
    classType: 'interestedBecause',
    lastOfSection: false,
    orderIndex: 1
  },
  {
    title: 'interestedBecauseTwo',
    defaultValue: 'I also like that we share a mutual passion for',
    classType: 'interestedBecause',
    lastOfSection: true,
    orderIndex: 1
  },
  {
    title: 'softwareInterestsOne',
    defaultValue: 'I would be especially excited about the idea of working with the (company) software stack because I see that it employs many of my favorite languages and technologies',
    options:
      [{
        title: 'Front-End',
        sentence: 'I can easily see that your software already fosters a fantastic user experience and I would love nothing more than to further that aim'
      },
      {
        title: 'Back-end',
        sentence: 'because it is evident that you are growing within the industry and I would be enthusiastic to help you scale and optimize your back-end.'
      }
      ],
    classType: 'interestedBecause',
    lastOfSection: false,
    orderIndex: 1
  },

  // Paragraph Two
  {
    title: 'highlevelTechnicalSkillsOne',
    defaultValue: 'As for myself, I am a full-stack software engineer with experience in',
    classType: 'techSkills',
    lastOfSection: false,
    orderIndex: 2
  },
  {
    title: 'highlevelTechnicalSkillsTwo',
    defaultValue: 'I am also familiar with',
    classType: 'techSkills',
    lastOfSection: true,
    orderIndex: 2
  },
  {
    title: 'applicationExample',
    defaultValue: 'My favorite software engineering work involves optimizing relational databases, for example I recently worked on horizontally scaling an Amazon Web Services Microservice to take in a large RPS which mainly required optimizing database queries.',
    lastOfSection: false,
    orderIndex: 3
  },
  {
    title: 'interpersonalSkills',
    defaultValue: `In addition, I also possess empathetic interpersonal skills that enable me to be an effective leader.`,
    classType: 'interpersonalSkills',
    lastOfSection: true,
    orderIndex: 4
  },
  {
    title: 'reiteration',
    defaultValue: `My experience in working with both front-end and back-end technologies make me a great candidate for your (jobTitle) role at (company). I believe that my skills will contribute greatly to the team, and I look forward to discussing my qualifications with you.
    `,
    classType: 'reiterationParagraph',
    lastOfSection: false,
    orderIndex: 4
  }
]

// because it is evident that you are growing within the industry and I would be enthusiastic to help you scale and optimize your back-end.