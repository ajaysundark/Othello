// MongoDB connection parameters
var ejs = require('ejs');
var mongojs = require("mongojs");
var db = mongojs('mongodb://webcrows:umncsfall16@ds019068.mlab.com:19068/webcrowsdb', ['account','progress']);
//var othello = require('./client/js/othello.js');

// Start the server
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser());

app.set('view engine', 'ejs');
//var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
//app.engine('handlebars', handlebars.engine);
//app.set('view engine', 'handlebars');
var serv = require('http').Server(app);
;
//app.use(express.static(__dirname + '/client'));


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
    //res.render('login');
    res.sendFile(__dirname + '/client/login.html');
});
app.get('/about',function(req, res) {
    //res.render('about');
    res.sendFile(__dirname + '/client/about.html');
});
app.get('/signup',function(req, res) {
    //res.render('signup');
    res.sendFile(__dirname + '/client/signup.html');
});
app.get('/gamearea',function(req, res) {
    //res.render('gamearea');
    res.sendFile(__dirname + '/client/gamearea.html');
});
app.get('/login',function(req, res) {
    //res.render('login');
    res.sendFile(__dirname + '/client/login.html');
});
app.get('/error',function(req, res) {
    //res.render('login');
    res.sendFile(__dirname + '/client/error.html');
});
//app.get('/game',function(req, res) {
//    res.sendFile(__dirname + '/client/grid.html');
//});

app.post('/signupX', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;

  createUser(username, password, password_confirmation, function(err, user){
    if (err) {
      res.sendFile(__dirname + '/client/error.html');
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
      res.redirect('/gamearea');
    }
    else {
      res.sendFile(__dirname + '/client/error.html');
    }
  });
});

app.post('/move',function(req,res){
  //console.log("received "+ req.params.rows + req.params.cols);
  var row = req.body.rows;
  var col = req.body.cols;
  console.log("received "+ row);
  console.log("received "+ col);
  newtable = isValidMove(req.body.state, req.body.player,req.body.rows,req.body.cols);
    console.log("New move: ",newtable);
    
  if(newtable==false){
<<<<<<< HEAD
    console.log("it is a invalid move");
  }
  else{
      console.log("it is a valid move");
      if(GAME) {
          GAME.board = newtable;
          GAME.turn = (req.body.player == 1) ? 2 : 1;
          postBoard(GAME);
      }  
=======
    console.log("it is not a valid move");
  }
  else{
    console.log("it is valid");
>>>>>>> 0e5c72b2071188d8ef9537dce37670838443d105
  }
});

app.use('/client',express.static(__dirname + '/client'));


serv.listen(2000);

var io = require('socket.io')(serv,{});

var GAME;
initGame();

io.sockets.on('connection', function(socket){
  socket.on('enter room', function(){
    var game = GAME, player = game.players.length + 1;
    game.players.push(socket);

    socket.emit('accept', {player: player, board: game.board});
/*
    socket.on('hand', function(hand){
      var x = parseInt(hand[0]), y = parseInt(hand[1]);
      var conds = {
	turn        : game.turn === player,
	emptySquare : othello.getOccupant(game.board, x, y) === 0,
	reversible  : othello.handReverseNum(game.board, game.turn, x, y) > 0
      }
      if( conds.turn && conds.emptySquare && conds.reversible){
	game.board = othello.hand(game.board, game.turn, x, y);
	game.turn  = othello.nextPlayer(game.board, game.turn);
	postBoard(game);
	if( game.turn === 0 )
	  gameEnd(game, othello.winner(game.board));
      }
    });*/

    socket.on('disconnect', function(){
      if(GAME.players[0] === socket)
	initGame();
      else
	gameEnd(game, othello.anotherPlayer(player));
    });

    if(game.players.length === 2){
      game.turn = 1;
      //initGame();
      postBoard(game);
    }
  });
});


function handler (req, res) {
  var path = url.parse(req.url).pathname;
  page.urlhandler(path, res);
}

function initGame(){
  GAME = {
    players: [],
    // add the code to inital array
    board:   [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ,[0,0,0,1,2,0,0,0], [0,0,0,2,1,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ],
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

function postBoard(game){
  game.players.map(function(player){
    player.emit('board', {board: game.board, turn: game.turn});
  });
}

function isValidMove(board, tile, xstart, ystart){
  if (board[xstart][ystart]!=0||(!isOnBoard(xstart,ystart))){
    return false;
  }

  board[xstart][ystart] = tile;

  if(tile == 1){
    otherTile = 2;
  }
  else{
    otherTile = 1;
  }

  tilesToFlip = [];

  var dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];

  for(i=0;i<dirs.length;i++){
    xdir=dirs[i][0];
    ydir=dirs[i][1];
    x=xstart;
    y=ystart;
    x=x+xdir;
    y=y+ydir;
    if(isOnBoard(x,y)&&board[x][y]==otherTile){
      x=x+xdir;
      y=y+ydir;
      if(!isOnBoard(x,y)){
        continue;
      }
      while(board[x][y]==otherTile){
        x=x+xdir;
        y=y+ydir;
        if(!isOnBoard(x,y)){
          break;
        }
      }
      if(!isOnBoard(x,y)){
        continue;
      }
      if(board[x][y]==tile){
        while(true){
          x=x-xdir;
          y=y-ydir;
          if((x==xstart)&&(y==ystart)){
            break;
          }
          tilesToFlip.push([x,y]);
        }
      }
    }
  }

board[xstart][ystart]=0;
if(tilesToFlip.length==0){
  return false;
}

for(i=0;i<tilesToFlip.length;i++){
  xch=tilesToFlip[i][0];
  ych=tilesToFlip[i][1];
  board[xch][ych]=tile;
}
return board;
}

function isOnBoard(x,y){
  return((x>=0)&&(x<=7)&&(y>=0)&&(y<=7))
}
