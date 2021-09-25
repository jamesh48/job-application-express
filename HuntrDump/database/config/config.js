const path = require('path');
require('dotenv').config({ path: path.resolve('.env') });

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const model = name => database.models[name];

const JobApplications = require(path.resolve('HuntrDump/database/models/JobAppModel.js'))(sequelize, Sequelize.DataTypes);

const ApplicationsConfig = require(path.resolve(`HuntrDump/database/models/ConfigModel.js`))(sequelize, Sequelize.DataTypes);

module.exports = (database) = {
  sequelize: sequelize,
  models: { ApplicationsConfig, JobApplications },
  model
};