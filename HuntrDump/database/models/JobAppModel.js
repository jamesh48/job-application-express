module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define(`job_applications`, {
    postURL: {
      type: DataTypes.TEXT,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    jobTitle: {
      type: DataTypes.STRING,
    },
    advertisedSalary: {
      type: DataTypes.STRING,
    },
    jobLocation: {
      type: DataTypes.STRING,
    },
    jobIsRemote: {
      type: DataTypes.BOOLEAN,
    },
    jobDescription: {
      type: DataTypes.TEXT,
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

  return JobApplication;
};