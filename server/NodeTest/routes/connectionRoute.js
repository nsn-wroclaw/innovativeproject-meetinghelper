﻿var qr = require('qr-image');
var fs = require('fs');

var Result = require('../results/result.js')
var Success = Result.Success;
var Error = Result.Error;
var Model = require('../models/model.js');
var User = Model.User;
var Meeting = Model.Meeting;
var Sequelize = require('sequelize');
var Dictionary = require('../dictionary/dictionary.js');

var clients = [];

module.exports.HelloWorld = function(req, res) {
    if(req.session.user){
        res.endSuccess({id:req.session.user});
    } else {
        res.endSuccess("Server v0.10");
    }
};

module.exports.Ping = function(req, res) {
    res.endSuccess("PONG");
};

module.exports.SocketPing = function(req){
        req.io.emit('pong', JSON.stringify("PONG"));
};

module.exports.Connected = function (socket) {
    var hs = socket.handshake;
    console.log('\n A socket with sessionID ' + hs.sessionID + ' connected! \n');
    //var intervalID = setInterval(function () {
    //    hs.session.reload( function () { 
    //      hs.session.touch().save();
    //    });
    //}, 60 * 1000);
    socket.on('disconnect', function () {
        console.log('\n A socket with sessionID ' + hs.sessionID + ' disconnected! \n ');
    });
 
};




