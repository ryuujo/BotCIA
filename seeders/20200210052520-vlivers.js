"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Vlivers", [
      {
        name: "hana",
        fullName: "Hana Macchia",
        fanName: "Nijisenja",
        color: "0xa84300",
        avatarURL: "https://i.imgur.com/Ucd9tuK.jpg",
        channelURL: "https://www.youtube.com/channel/UCpJtk0myFr5WnyfsmnInP-w",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "zea",
        fullName: "ZEA Cornelia",
        fanName: "Berondong",
        color: "0xf1c40f",
        avatarURL: "https://i.imgur.com/3wHGHCD.jpg",
        channelURL: "https://www.youtube.com/channel/UCA3WE2WRSpoIvtnoVGq4VAw",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "taka",
        fullName: "Taka Radjiman",
        fanName: "Sobat Sukses",
        color: "0x3498db",
        avatarURL: "https://i.imgur.com/ZwHltQH.jpg",
        channelURL: "https://www.youtube.com/channel/UCZ5dNZsqBjBzbBl0l_IdmXg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "riksa",
        fullName: "Riksa Dhirendra",
        fanName: "Friendliner",
        color: "0xff0000",
        avatarURL: "https://i.imgur.com/HIJ20v8.jpg",
        channelURL: "https://www.youtube.com/channel/UCkL9OLKjIQbKk2CztbpOCFg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "miyu",
        fullName: "Miyu Ottavia",
        fanName: "Ottagang",
        color: "0xff8b00",
        avatarURL: "https://i.imgur.com/ii9y9vg.jpg",
        channelURL: "https://www.youtube.com/channel/UCOmjciHZ8Au3iKMElKXCF_g",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "amicia",
        fullName: "Amicia Michella",
        fanName: "Cinguin",
        color: "0x00a21d",
        avatarURL: "https://i.imgur.com/fNkL1hX.jpg",
        channelURL: "https://www.youtube.com/channel/UCrR7JxkbeLY82e8gsj_I0pQ",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "rai",
        fullName: "Rai Galilei",
        fanName: "Inmates",
        color: "0x9b59b6",
        avatarURL: "https://i.imgur.com/6T2VOhp.jpg",
        channelURL: "https://www.youtube.com/channel/UC8Snw5i4eOJXEQqURAK17hQ",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "nijisanji_id",
        fullName: "NIJISANJI ID Official",
        color: "0x2c496d",
        avatarURL: "https://i.imgur.com/QKxijXI.png",
        channelURL: "https://www.youtube.com/channel/UCbLgcjfsUaCUgJh9SVit8kwx",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Vlivers", null, {});
  }
};
