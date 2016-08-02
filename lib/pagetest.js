'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var http = require('http');

var iBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'mufc';
    this.user = null;
};

util.inherits(iBot, Bot);

iBot.prototype.run = function () {
    iBot.super_.call(this, this.settings);
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

iBot.prototype._onStart = function () {
    this._loadBotUser();
};

iBot.prototype._loadBotUser = function(){
    var self = this;
    this.user = this.users.filter(function (user){
        return user.name === self.name;
    })[0];
};

iBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) && !this._isFromiBot(message)) 
    {
        this._smartresponse(message);
    }
};

iBot.prototype._smartresponse = function (originalMessage) {
    var self = this;
    var channel = self._getChannelById(originalMessage.channel);
    var newMessage = originalMessage.text.split('>: ')[1];
    var p = 'First View ';
    var q = ' & Repeat View ';
    try {
     var n = JSON.parse(fs.readFileSync('jsonResult.json', 'utf8'));
    } catch (e) {
        console.log('E - ' + e);
    };
    var s = n.data.average;
    console.log(s.firstView);

                var a = p + newMessage + ': ' + s.firstView[newMessage] + q + newMessage + ': ' + s.repeatView[newMessage];
                self.postMessageToChannel(channel.name, a, {as_user: true});
};

iBot.prototype._loadBotUser = function(){
    var self = this;
    this.user = this.users.filter(function (user){
        return user.name === self.name;
    })[0];
};

iBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

iBot.prototype._isFromiBot = function (message) {
    return message.user === this.user.id;
};

iBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
        })[0];
};

module.exports = iBot;