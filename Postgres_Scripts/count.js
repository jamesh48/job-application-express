const path = require('path');
const colors = require('colors');
// https://levelup.gitconnected.com/using-the-sequelize-cli-and-querying-4ba8d0ac4314

(async () => {
  const { JobApplications } = require(path.resolve('HuntrDump/database/config/config.js')).models;
  const count = await JobApplications.count()
  console.log(`
          You currently have-> ${count} applications in the database

  `.green)
  process.exit()
})()