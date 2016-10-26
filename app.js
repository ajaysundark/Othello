// MongoDB connection parameters
var mongojs = require("mongojs");
var db = mongojs('mongodb://webcrows:umncsfall16@ds019068.mlab.com:19068/webcrowsdb', ['account','progress']);

// Start the server
var express = require('express');
var app = express();
var serv = require('http').Server(app);
app.use(require('body-parser').urlencoded({extended: true}));

function createUser(username, password, password_confirmation, callback){
    if (password !== password_confirmation) {
    var err = 'The passwords do not match';
    callback(err);
  } else {
      db.account.find({username: username}, function(err, user){
      if (!(user.length==0)) {
        err = 'The username you entered already exists';
        callback(err);
      } else {
            db.account.insert({username: username, password: password},function(err,user){
            callback(err,user);
        });
      }
    });
  }
}

function authenticateUser(username, password, callback){

  db.account.find({username: username, password: password}, function(err, user){
    if ((user.length==0)||(user.password==0)) {
      err = 'Credentials do not match';
      callback(err);
    } else {
        callback(err, user);
    }
  });
}

// This is the client home page
app.get('/',function(req, res) {
    //res.sendFile(__dirname + '/client/index.html');
    res.sendFile(__dirname + '/client/login.html');
});
app.get('/about',function(req, res) {
    res.sendFile(__dirname + '/client/about.html');
});
app.get('/signup',function(req, res) {
    res.sendFile(__dirname + '/client/signup.html');
});
app.get('/gamearea',function(req, res) {
    res.sendFile(__dirname + '/client/gamearea.html');
});
app.post('/signupX', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;

  createUser(username, password, password_confirmation, function(err, user){
    if (err) {
      res.sendFile(__dirname + '/client/error.html');
      //res.render('signup', {error: err});
    } else {
      res.redirect('/');
    }
  });
});
app.post('/loginX', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  authenticateUser(username, password, function(err, user){
    if (user) {
      //req.session.username = user.username;
      res.redirect('/gamearea');
    }
    else {
      res.sendFile(__dirname + '/client/error.html');
    }
  });
});
app.use('/client',express.static(__dirname + '/client'));

// Port number - to be configured using nconf later
serv.listen(2000);

var io = require('socket.io')(serv,{});

////////////////

var GAME;
initGame();

io.sockets.on('connection', function(socket){

  socket.on('enter room', function(){
    var game = GAME, player = game.players.length + 1;
    game.players.push(socket);


    socket.emit('accept', {player: player, board: game.board});

    socket.on('disconnect', function(){
      if(GAME.players[0] === socket)
	     initGame();
      else
	     gameEnd(game, anotherPlayer(player));
    });

    if(game.players.length === 2){
      game.turn = 1;
      console.log("This is one instance of a game");
      initGame();
    }
  });
});

function initGame(){
  GAME = {
    players: [],
    turn:    0
  }
}

function gameEnd(game, winner){
  game.players.map(function(player){
    player.emit('game end', {
      winner: winner,
      points: [othello.count(game.board, 1), othello.count(game.board, 2)]
    });
  });
}

function anotherPlayer(player){
  return player % 2 + 1;
}
