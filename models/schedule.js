"use strict";
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      title: DataTypes.STRING,
      youtubeUrl: DataTypes.STRING,
      dateTime: DataTypes.DATE,
      vliverID: DataTypes.INTEGER,
      type: DataTypes.ENUM("live", "premiere")
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );
  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Vliver, { foreignKey: "vliverId", as: "vliver" });
  };
  return Schedule;
};
