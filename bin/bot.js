'use strict';
var SethuBot = require('../lib/sampleurlimg');

var token = process.env.BOT_API_KEY || require('../token');
var name = process.env.BOT_NAME;

var sethbot = new SethuBot({
    token: token,
    name: name
});
sethbot.run();
