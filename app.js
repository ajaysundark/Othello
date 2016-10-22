// MongoDB connection parameters
var mongojs = require("mongojs");
var db = mongojs('mongodb://webcrows:umncsfall16@ds019068.mlab.com:19068/webcrowsdb', ['account','progress']);

// Start the server
var express = require('express');
var app = express();
var serv = require('http').Server(app);

// This is the client hoem page
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/about',function(req, res) {
    res.sendFile(__dirname + '/client/about.html');
});
app.use('/client',express.static(__dirname + '/client'));

// Port number - to be configured using nconf later
serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};

var Player = function(id){
  var self = {
      id:"",
  }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket){
    var player = Player(socket.id);
}
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}

var DEBUG = true;

var isValidPassword = function(data,cb){
    db.account.find({username:data.username,password:data.password},function(err,res){
        console.log(res.length);
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var isUsernameTaken = function(data,cb){
    db.account.find({username:data.username},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var addUser = function(data,cb){
    db.account.insert({username:data.username,password:data.password},function(err){
        cb();
    });
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    socket.on('signIn',function(data){
        isValidPassword(data,function(res){
            if(res){
                Player.onConnect(socket);
                socket.emit('signInResponse',{success:true});
            } else {
                socket.emit('signInResponse',{success:false});
            }
        });
    });
    socket.on('signUp',function(data){
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});
            } else {
                addUser(data,function(){
                    socket.emit('signUpResponse',{success:true});
                });
            }
        });
    });
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    socket.on('sendMsgToServer',function(data){
        var playerName = ("" + socket.id).slice(2,7);
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
        }
    });
    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });
});
