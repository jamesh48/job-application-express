module.exports = (dataObj) => {
  const { demographicInfo: { data: [x, availableJobTitle] } } = dataObj;

  const handleSentence = (sentence) => {

    const handleStr = (str) => {
      if (str.indexOf('(company)') > -1) {
        str = str.replaceAll('(company)', companyName);
      }

      if (str.indexOf('(jobTitle)') > -1) {
        str = str.replaceAll('(jobTitle)', availableJobTitle);
      }

      // remove trailing period...
      if (str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
      }
      return str;
    }

    return `${handleStr(sentence)}. `;
  };


  const generate = () => {
    return Object.values(dataObj).sort((a, b) => a.orderIndex - b.orderIndex).reduce((totalStr, inputArr, order) => {

      if (order === 2 || order === 5) { totalStr += '\n\n' }

      return totalStr += inputArr.data.reduce((total, entry) => {
        // order === 3 means that interpersonal skills is hard coded.
        if (entry.value && entry.defaultValue !== 'undefined' && (entry.value !== entry.defaultValue) || order >= 3) {
          return total += handleSentence(entry.value);
        };
        return total;
      }, '');
    }, '');
  }

  return (
`
Hello,

${generate()}

Best Regards,

${process.env.FIRSTNAME}

${process.env.PHONENUMBER} | ${process.env.EMAIL}
${process.env.WEBSITE}
${process.env.LINKEDIN} | ${process.env.GITHUB}
`
  );
}