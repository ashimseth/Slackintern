'use strict';

var iBot1 = require('../lib/iBot');

var token = process.env.BOT_API_KEY || require('../token');
var name = process.env.BOT_NAME;

var ibot = new iBot1({
    token: token,
    name: name
});
ibot.run();
