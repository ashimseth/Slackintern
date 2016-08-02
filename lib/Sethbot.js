'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var http = require('http');
var urlName = 'http://mytime.timeinc.net/scripts/phone_search/get_json_full.php?';
var urlSearchText = '&searchtext=';
var urlFirstName = '&firstname=';
var urlLastName = '&lastname=';

var SethuBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'mufc';
    this.user = null;
};

util.inherits(SethuBot, Bot);
    
SethuBot.prototype.run = function () {
    SethuBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

SethuBot.prototype._onStart = function () {
    this._loadBotUser();
};

SethuBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) && !this._isFromSethuBot(message)) 
    {
        this._smartresponse(message);
    }
};

SethuBot.prototype._smartresponse = function (originalMessage) {
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
    else {
        name = newMessage.split(' ');
        firstName = name[0];
        lastName = name[1];
    }
    var urlToQuery = '';
    if (typeof lastName !== 'undefined') {
        urlToQuery = urlName + urlFirstName + firstName + urlLastName + lastName;
        } else {
            urlToQuery = urlName + urlSearchText + firstName;
        }

    http.get(urlToQuery, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
    
        res.on('end', function(response) {
            var newdata = JSON.parse(body);
            var errormsg = 'Data not available in the directory';
            if (newdata.phone_search.count == 0){
                self.postMessageToChannel(channel.name, errormsg, {as_user: true});
            };
            newdata.phone_search.row.forEach(function(record) {
                var a = record.firstname + ' ' + record.lastname + ': ' + record.phone;
                self.postMessageToChannel(channel.name, a, {as_user: true});
            });
        });

    });
};

SethuBot.prototype._loadBotUser = function(){
    var self = this;
    this.user = this.users.filter(function (user){
        return user.name === self.name;
    })[0];
};

SethuBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
    };

SethuBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
    };

SethuBot.prototype._isFromSethuBot = function (message) {
    return message.user === this.user.id;
    };

SethuBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
        })[0];
    };

module.exports = SethuBot;
