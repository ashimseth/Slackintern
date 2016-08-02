'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var http = require('http');
var urlName1 = 'http://timeinc.condecosoftware.com/Content/Uploads/';
var urlName2 = 'THFL-';
var sample = '.jpg';

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

SethuBot.prototype._loadBotUser = function(){
    var self = this;
    this.user = this.users.filter(function (user){
        return user.name === self.name;
    })[0];
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
    var newMessage = originalMessage.text.split('>:')[1];
    var target = originalMessage.text.split('>:')[0];

    if(!~target.indexOf(this.user.id)) {
        return;
    }

    if(!newMessage || !newMessage.length){
        return;
    }

    newMessage = newMessage.replace(/[^a-zA-Z0-9]/g,'');

    var wingRegEx = /[NEWS]/i;

    var wingPos = newMessage.search(wingRegEx);

    var floor = parseInt(newMessage.substring(0,wingPos), 10);
    var wing = newMessage.charAt(wingPos).toUpperCase();
    var room = parseInt(newMessage.substring(wingPos+1), 10);

    if(Number.isNaN(room) || Number.isNaN(floor) || !wingRegEx.test(wing)){
        return;
    }
    var roomurl = urlName1 + floor + urlName2 + wing + room + sample;

    http.get(roomurl, function(response) {
        if (originalMessage.username !== 'slackbot') {
            self.postMessageToChannel(channel.name, roomurl, {as_user: true})
    } 
        else {
            self.postMessageToChannel(channel.name, '', {as_user: true})
    }
    })
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

SethuBot.prototype._isFromSethuBot = function (message) {
    return message.user === this.user.id;
};

SethuBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
        })[0];
};

module.exports = SethuBot;
