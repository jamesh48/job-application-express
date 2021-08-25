const sequelize = require('../database/config/config.js');

module.exports = {
  getRecentJobApps: async () => {
    const { JobApplications } = sequelize.models;
    try {
      const currentApplications = await JobApplications.findAll();
      return currentApplications;
    } catch (err) {
      console.log(err);
    }
  },
  postNewJobApp: async (appObj) => {
    const { ApplicationsConfig, JobApplications } = sequelize.models;
    try {
      await JobApplications.create(appObj)

      let jobApplicationsCountTest = await ApplicationsConfig.findAll({ where: { id: 1 } });

      // If Count Doesnt Exist make it, otherwise increment it
      if (!jobApplicationsCountTest.length) {
        await ApplicationsConfig.create({ jobApplicationsCount: 1 });
      } else {
        await ApplicationsConfig.increment('jobApplicationsCount', { by: 1, where: { id: 1 } });
      };

      return 'ok';
    } catch (err) {
      console.log(err);
    }
  },

};