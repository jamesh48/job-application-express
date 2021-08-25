'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postURL: {
        type: Sequelize.TEXT,
      },
      companyName: {
        type: Sequelize.STRING
      },
      jobTitle: {
        type: Sequelize.STRING
      },
      advertisedSalary: {
        type: Sequelize.STRING,
      },
      jobLocation: {
        type: Sequelize.STRING,
      },
      jobIsRemote: {
        type: Sequelize.BOOLEAN,
      },
      jobDescription: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('job_applications');
  }
};