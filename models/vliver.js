'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vliver = sequelize.define(
    'Vliver',
    {
      name: DataTypes.STRING,
      fullName: DataTypes.STRING,
      fanName: DataTypes.STRING,
      color: DataTypes.STRING,
      avatarURL: DataTypes.STRING,
      channelURL: DataTypes.STRING
    },
    {}
  );
  Vliver.associate = function(models) {
    // associations can be defined here
  };
  return Vliver;
};
