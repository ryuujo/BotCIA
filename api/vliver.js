const { Op } = require('sequelize');
const Vliver = require('../models').Vliver;

exports.list = async function (req, res) {
  //console.log(req.query);
  let vData;
  if (req.query.name) {
    vData = await Vliver.findOne({
      where: {
        [Op.or]: [{ name: req.query.name }, { fullName: req.query.name }],
      },
    });
    if (!vData) {
      return res.json({
        vliver: [],
        response: 404,
        responseText: 'The name is not existed in our Database',
      });
    }
  } else {
    vData = await Vliver.findAll();
  }
  res.json({ vliver: vData, response: 200, responseText: 'OK' });
};
