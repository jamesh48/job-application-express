module.exports = (sequelize, DataTypes) => {
  const ApplicationsConfig = sequelize.define(`applications_configs`, {
    jobApplicationsCount: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  }, {
    timestamps: true
  });

  return ApplicationsConfig;
};