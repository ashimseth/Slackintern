'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var http = require('http');
var Slack = require('node-slack-upload');
var stream = require('stream');
var baseurl = 'http://mytime.timeinc.net/wp-content/uploads/2016/01/2015-';
var endurl = 'TH-FLOOR-PLAN-WITH-NUMBERS.pdf';
var urlName1 = 'http://timeinc.condecosoftware.com/Content/Uploads/';
var urlName2 = 'THFL';
var sample = '.jpg';

var exist_room = {
    "09E020" : {},
    "09S303" : {},
    "09S309" : {},
    "09S315" : {},
    "09S550" : {},
    "09S626" : {},
    "09W308" : {},
    "08E135" : {},
    "08N111" : {},
    "08S303" : {},
    "08S309" : {},
    "08S315" : {},
    "08S550" : {},
    "08S626" : {},
    "08W308" : {},
    "07E020" : {},
    "07E142" : {},
    "07E144" : {},
    "07N111" : {},
    "07S303" : {},
    "07S309" : {},
    "07S315" : {},
    "07S321" : {},
    "07S551" : {},
    "07W110" : {},
    "07W308" : {},
    "06E115" : {},
    "06W110" : {},
    "06E020" : {},
    "06S116" : {},
    "06E111" : {},
    "04S600" : {},
    "04S626" : {},
    "9E020" : {},
    "9S303" : {},
    "9S309" : {},
    "9S315" : {},
    "9S550" : {},
    "9S626" : {},
    "9W308" : {},
    "8E135" : {},
    "8N111" : {},
    "8S303" : {},
    "8S309" : {},
    "8S315" : {},
    "8S550" : {},
    "8S626" : {},
    "8W308" : {},
    "7E020" : {},
    "7E142" : {},
    "7E144" : {},
    "7N111" : {},
    "7S303" : {},
    "7S309" : {},
    "7S315" : {},
    "7S321" : {},
    "7S551" : {},
    "7W110" : {},
    "7W308" : {},
    "6E115" : {},
    "6W110" : {},
    "6E020" : {},
    "6S116" : {},
    "6E111" : {},
    "4S600" : {},
    "4S626" : {}
};

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

    room = room >= 100 ? room : "0" + room;
    var dude = floor + wing + room;
    
    if(Number.isNaN(room) || Number.isNaN(floor) || !wingRegEx.test(wing)){
        return;
    }
    var roomurl = '';
    
    if(exist_room.hasOwnProperty(dude)){
        if (floor <= 6) {
            roomurl = urlName1 + floor + urlName2 + floor + '-' + wing + room + sample;
        } else {
            roomurl = urlName1 + floor + urlName2 + '-' + wing + room + sample;
            }
    
    http.get(roomurl, function(response) {
        if (originalMessage.username !== 'slackbot') {
            self.postMessageToChannel(channel.name, roomurl, {as_user: true}) }
        })
    } 
    else { 
            switch (floor){
                case 4:
                case 8:
                        roomurl = baseurl + '1110-' + floor + endurl;
                        break;
                case 5:
                case 6:
                        roomurl = baseurl + '1207-' + floor + endurl;
                        break;
                case 7:
                        roomurl = baseurl + '1120-' + floor + endurl;
                        break;
                case 9:
                        roomurl = baseurl + '1216-' + floor + endurl;
            }        
     http.get(roomurl, function(response) {
        if (originalMessage.username !== 'slackbot') {
            self.postMessageToChannel(channel.name, "Couldn't find the room but I guess this should help: " + roomurl, {as_user: true})
    } 
    })
 }
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

iBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
    };

iBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
        })[0];
};

module.exports = iBot;

