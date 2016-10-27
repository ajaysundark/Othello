var ejs = require('ejs');
var mongojs = require("mongojs");
var db = mongojs('mongodb://webcrows:umncsfall16@ds019068.mlab.com:19068/webcrowsdb', ['account','progress']);
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser());
app.set('view engine', 'ejs');
var serv = require('http').Server(app);

app.get('/',function(req, res) {
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
app.get('/spectator',function(req, res) {
    res.sendFile(__dirname + '/client/spectator.html');
});
app.get('/login',function(req, res) {
    res.sendFile(__dirname + '/client/login.html');
});
app.get('/error',function(req, res) {
    res.sendFile(__dirname + '/client/error.html');
});

app.post('/signupX', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.confirmation;
    
  console.log("username: ", req.body.username);
  console.log("password: ", req.body.password)
  console.log("confirmation: ", req.body.confirmation);
    
  createUser(username, password, password_confirmation, function(err, user){
    var status = true;
    var redirect = true;
    var redirectURL = '/';
    if (err) {
      status = false;
      redirect = true;
      redirectURL = (__dirname + '/client/error.html');
      /*res.sendFile(__dirname + '/client/error.html');*/
    }
    
    res.send(JSON.stringify({success: status, redirect: redirect, url: redirectURL}));
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
  var row = req.body.rows;
  var col = req.body.cols;
  newtable = isValidMove(req.body.state, req.body.player,req.body.rows,req.body.cols);

  if(newtable==false || GAME.turn != req.body.player){
    console.log("it is a invalid move");
  }
  else{
      console.log("it is a valid move");
      emptyflag=0;
      for(i=0;i<7;i++){
        for(j=0;j<7;j++){
          if(newtable[i][j]==0){
            emptyflag=1;
            break;
          }
        }
        if(emptyflag==1){
          break;
        }
      }
      if(emptyflag==0){
        count1 = 0;
        count2 = 0;
        for(i=0;i<7;i++){
          for(j=0;j<7;j++){
            if(newtable[i][j]==1){
              count1++;
            }
            else{
              count2++;
            }
          }
        }
        if(count1>count2){
          winner = 1;
        }
        else{
          winner=2;
        }
        timestamp = Date.now();
        //
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
           dd='0'+dd
        }

        if(mm<10) {
           mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        console.log(today);
        //
        gameEnd(GAME,winner,count1,count2,today);
      }
      else {
          GAME.board = newtable;
          GAME.turn = (req.body.player == 1) ? 2 : 1;
          console.log(GAME.board);
          postBoard(GAME);
      }
  }
});

app.get('/statistics', function(req, res){
  db.progress.find({}).toArray(function(err, stats_array) {
    console.log(stats_array);
    return res.json(stats_array);
  });

});

app.use('/client',express.static(__dirname + '/client'));


serv.listen(2000);

var io = require('socket.io')(serv,{});

var GAME;
var spec = [];
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
         console.log();
    });

    if(game.players.length === 2){
      game.turn = 1;
      //initGame();
      postBoard(game,0);
    }
  });
  socket.on('spec room', function(){
    spec.push(socket);
  });
});

function initGame(){
  GAME = {
    players: [],
    board:   [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ,[0,0,0,1,2,0,0,0], [0,0,0,2,1,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ],
    turn:    0
  }
}

function gameEnd(game, winner,count1,count2,today){
  var winnerToInsert = winner;
  var count1ToInsert = count1;
  var count2ToInsert = count2;
  var tsToInsert = today;
  db.progress.insert({winner: winnerToInsert, count1: count1ToInsert, count2: count2ToInsert, timeStamp: tsToInsert});
  //
  game.players.map(function(player){
    player.emit('game end', {
      winner: winner,
      count1: count1,
      count2: count2,
      timestamp: timestamp
    });
  });
}

function postBoard(game,flag){
  game.players.map(function(player){
    console.log("hh ",flag);
    player.emit('board', {board: game.board, turn: game.turn, flag: flag });
  });
  spec.map(function(sp){
    sp.emit('spec', {board: game.board});
  });
}

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
board[xstart][ystart]=tile;
return board;
}

function isOnBoard(x,y){
  return((x>=0)&&(x<=7)&&(y>=0)&&(y<=7))
}
