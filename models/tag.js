"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      command: DataTypes.STRING,
      response: DataTypes.TEXT("long"),
      createdBy: DataTypes.STRING,
      count: DataTypes.INTEGER
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci"
    }
  );
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
