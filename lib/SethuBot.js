// 'use strict';

// var util = require('util');
// var path = require('path');
// var fs = require('fs');
// var SQLite = require('sqlite3').verbose();
// var Bot = require('slackbots');
// var http = require('http');
// // var url = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?searchType=&startrow=0&quick=phone&searchtext=mike&lastname=&firstname=&phone=&org=&building=&locationcode=';
// var url = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?searchType=&startrow=0&quick=phone&searchtext=';



// /**
//  * Constructor function. It accepts a settings object which should contain the following keys:
//  *      token : the API token of the bot (mandatory)
//  *      name : the name of the bot (will default to "norrisbot")
//  *      dbPath : the path to access the database (will default to "data/norrisbot.db")
//  *
//  * @param {object} settings
//  * @constructor
//  *
//  * @author Luciano Mammino <lucianomammino@gmail.com>
//  */
// var SethuBot = function Constructor(settings) {
//     this.settings = settings;
//     this.settings.name = this.settings.name || 'happysingh';
//     this.dbPath = settings.dbPath || path.resolve(__dirname, '..', 'data', 'norrisbot.db');

//     this.user = null;
//     this.db = null;
// };

// // inherits methods and properties from the Bot constructor
// util.inherits(SethuBot, Bot);

// /**
//  * Run the bot
//  * @public
//  */
// SethuBot.prototype.run = function () {
//     this.on('start', this._onStart);
//     this.on('message', this._onMessage);
// };

// /**
//  * On Start callback, called when the bot connects to the Slack server and access the channel
//  * @private
//  */
// SethuBot.prototype._onStart = function () {
//     this._loadBotUser();
//     this._connectDb();
//     this._firstRunCheck();
// };

// /**
//  * On message callback, called when a message (of any type) is detected with the real time messaging API
//  * @param {object} message
//  * @private
//  */
// SethuBot.prototype._onMessage = function (message) {

//     if (this._isChatMessage(message) &&
//         // this._isChannelConversation(message) &&
//         !this._isFromSethuBot(message) 
//         // this._isMentioningChuckNorris(message)
//     ) {
//         this._contactdetail(message);
//     }

//     // if(this._isChatMessage(message)) {
//     //     this._replyWithRandomJoke(message);
//     // }
// };

// /**
//  * Replyes to a message with a random Joke
//  * @param {object} originalMessage
//  * @private
//  */
// SethuBot.prototype._contactdetail = function (originalMessage) {
//     var self = this;
//     var channel = self._getChannelById(originalMessage.channel);
//     var newMessage = originalMessage.text.split('>: ')[1];
//     http.get(url + newMessage, function(res){
//         var body = '';

//         res.on('data', function(chunk){
//             body += chunk;
//         });

//         res.on('end', function(response){
//             var newdata = JSON.parse(body);
//             newdata.phone_search.row.forEach(function(record){
//                 var a = record.firstname + ' ' + record.lastname + ': ' + record.phone;
//                 self.postMessageToChannel(channel.name, a, {as_user: true});
//             });
//         });
    

//     })
//     .on('error', function(e){
//         console.log("Got an error: ", e);
//     });
// };

// function test(data){
//     var newdata = JSON.parse(data);
//     newdata.phone_search.row.forEach(function(record){
//         var a = record.firstname + ' ' + record.lastname + ': ' + record.phone;
//         return a;
//     });
// }

// /**
//  * Loads the user object representing the bot
//  * @private
//  */
// SethuBot.prototype._loadBotUser = function () {
//     var self = this;
//     this.user = this.users.filter(function (user) {
//         return user.name === self.name;
//     })[0];
// };

// /**
//  * Open connection to the db
//  * @private
//  */
// // SethuBot.prototype._connectDb = function () {
// //     if (!fs.existsSync(this.dbPath)) {
// //         console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
// //         process.exit(1);
// //     }

// //     this.db = new SQLite.Database(this.dbPath);
// // };

// /**
//  * Check if the first time the bot is run. It's used to send a welcome message into the channel
//  * @private
//  */
// // SethuBot.prototype._firstRunCheck = function () {
// //     var self = this;
// //     self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
// //         if (err) {
// //             return console.error('DATABASE ERROR:', err);
// //         }

// //         var currentTime = (new Date()).toJSON();

// //         // this is a first run
// //         if (!record) {
// //             self._welcomeMessage();
// //             return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
// //         }

// //         // updates with new last running time
// //         self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
// //     });
// // };

// /**
//  * Sends a welcome message in the channel
//  * @private
//  */
// // SethuBot.prototype._welcomeMessage = function () {
// //     this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
// //         '\n I can tell jokes, but very honest ones. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
// //         {as_user: true});
// // };

// /**
//  * Util function to check if a given real time message object represents a chat message
//  * @param {object} message
//  * @returns {boolean}
//  * @private
//  */
// SethuBot.prototype._isChatMessage = function (message) {
//     return message.type === 'message' && Boolean(message.text);
// };

// /**
//  * Util function to check if a given real time message object is directed to a channel
//  * @param {object} message
//  * @returns {boolean}
//  * @private
//  */
// SethuBot.prototype._isChannelConversation = function (message) {
//     return typeof message.channel === 'string' && message.channel[0] === 'C';
// };

// /**
//  * Util function to check if a given real time message is mentioning Chuck Norris or the norrisbot
//  * @param {object} message
//  * @returns {boolean}
//  * @private
//  */
// // SethuBot.prototype._isMentioningChuckNorris = function (message) {
// // };

// /**
//  * Util function to check if a given real time message has ben sent by the norrisbot
//  * @param {object} message
//  * @returns {boolean}
//  * @private
//  */
// SethuBot.prototype._isFromSethuBot = function (message) {
    
//     return message.user === this.user.id;
// };

// /**
//  * Util function to get the name of a channel given its id
//  * @param {string} channelId
//  * @returns {Object}
//  * @private
//  */
// SethuBot.prototype._getChannelById = function (channelId) {
    
//     return this.channels.filter(function (item) {
//         return item.id === channelId;
//     })[0];
// };

// module.exports = SethuBot;
