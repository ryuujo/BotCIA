const { google } = require('googleapis');
const { googleApi } = require('../config');

const youtube = google.youtube({
  version: 'v3',
  auth: googleApi,
});

module.exports = { youtube };
