const router = require('express').Router();
const { apiVersion } = require('../package.json');
const vliverAPI = require('./vliver');

router.get('/', function (req, res) {
  return res.json({
    response: 200,
    responseText: `BotCIA API v${apiVersion}. OK!`,
  });
});
router.get('/vliver', vliverAPI.list);

module.exports = router;
