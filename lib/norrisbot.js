'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var http = require('http');
var urlName = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?';
var urlFirstName = 'firstname=';
var urlLastName = '&lastname=';
var urlLName = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?firstname=searchType=&startrow=0&quick=phone&searchtext='

var NorrisBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'happysingh';
    // this.dbPath = settings.dbPath || path.resolve (process.cwd(), 'data', 'norrisbot.db');
    this.user = null;
    // this.db = null;
};


util.inherits(NorrisBot, Bot);

NorrisBot.prototype.run = function () {
    NorrisBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

NorrisBot.prototype._onStart = function () {
    this._loadBotUser();
    // this._connectDb();
    // this._firstRunCheck();
};

NorrisBot.prototype._onMessage = function (message) {

    if (this._isChatMessage(message) &&
        // this._isChannelConversation(message) &&
        !this._isFromNorrisBot(message) 
        // this._isMentioningChuckNorris(message)
    ) {
        this._replyWithRandomJoke(message);
    }

    // if(this._isChatMessage(message)) {
    //     this._replyWithRandomJoke(message);
    // }
};

NorrisBot.prototype._replyWithRandomJoke = function (originalMessage) {
    // var url = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?searchType=&startrow=0&quick=phone&firstname=';
    // var urlFirstName = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?firstname=';
    // var urlLastName = '&lastname=';

    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    var newMessage = originalMessage.text.split('>: ')[1];
    
    var firstName = '';
    var lastName = '';
    
    var name = newMessage.split(', ');
    
    if (name[1]) {  
        firstName = name[1];
        lastName = name[0];
    }
    else{
        name = newMessage.split(' ');
        firstName = name[0];
        lastName = name[1];
    }
    var urlToQuery = urlName + urlFirstName + firstName;
    
    if (typeof lastName !== 'undefined'){
        urlToQuery += urlLastName + lastName;
    }

    http.get(urlToQuery, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(response){
            var newdata = JSON.parse(body);
            var errormsg = 'Data not available in the directory';
            if (newdata.phone_search.count == 0){
                self.postMessageToChannel(channel.name, errormsg, {as_user: true});
            }
            newdata.phone_search.row.forEach(function(record){
                // console.log(record);
                var a = record.firstname + ' ' + record.lastname + ': ' + record.phone;
                // console.log(a);
                // return a;
                self.postMessageToChannel(channel.name, a, {as_user: true});
                
            // console.log(channel.name);
            });
    });

    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
};
// function test(data) {
//     // console.log(data);
//     var newdata = JSON.parse(data);
//     // console.log(newdata.phone_search.row);
//     newdata.phone_search.row.forEach(function(record){
//     var a = record.firstname + ' ' + record.lastname + ': ' + record.phone;
//     // console.log(a);
//     return a;
//     });
// }

/**
 * Loads the user object representing the bot
 * @private
 */
NorrisBot.prototype._loadBotUser = function () {
    var self = this;
    // console.log(this.users[0]);
    this.user = this.users.filter(function (user) {
        // console.log(user.name);
        return user.name === self.name;
    })[0];
};

/**
 * Open connection to the db
 * @private
 */
// NorrisBot.prototype._connectDb = function () {
//     if (!fs.existsSync(this.dbPath)) {
//         console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
//         process.exit(1);
//     }

//     this.db = new SQLite.Database(this.dbPath);
// };

/**
 * Check if the first time the bot is run. It's used to send a welcome message into the channel
 * @private
 */
// NorrisBot.prototype._firstRunCheck = function () {
//     var self = this;
//     self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
//         if (err) {
//             return console.error('DATABASE ERROR:', err);
//         }

//         var currentTime = (new Date()).toJSON();

//         // this is a first run
//         if (!record) {
//             self._welcomeMessage();
//             return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
//         }

//         // updates with new last running time
//         self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
//     });
// };

/**
 * Sends a welcome message in the channel
 * @private
 */
// NorrisBot.prototype._welcomeMessage = function () {
//     this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
//         '\n I can tell jokes, but very honest ones. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
//         {as_user: true});
// };

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'
        ;
};

/**
 * Util function to check if a given real time message is mentioning Chuck Norris or the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isMentioningChuckNorris = function (message) {
    // console.log(message.text.toLowerCase().indexOf('chuck norris'));
    // console.log(message.text.toLowerCase().indexOf('whatever'));
    // return message.text.toLowerCase().indexOf('chuck norris') > -1 || 
    //        message.text.toLowerCase().indexOf(this.name) > -1;
    // return "HI!!!!";
};

/**
 * Util function to check if a given real time message has ben sent by the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
NorrisBot.prototype._isFromNorrisBot = function (message) {
    
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
NorrisBot.prototype._getChannelById = function (channelId) {
    
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = NorrisBot;
