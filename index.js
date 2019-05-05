var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var players = [];
var times = [];
var moves = [];
var games = [];

var move = [4,1,4,3];
var gameID = 0;

function timer() {
  for (var i = 0; i < moves.length; i++) {
    if (moves[i] == 1) {
      times[i] += 1;
    }
  }
}

startBoard = [
  ['br','bn','bb','bq','bk','bb','bn','br'],
  ['bp','bp','bp','bp','bp','bp','bp','bp'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['wp','wp','wp','wp','wp','wp','wp','wp'],
  ['wr','wn','wb','wq','wk','wb','wn','wr']
]

/*console.log(startBoard[0][0])
console.log(startBoard[0][1])
console.log(startBoard[1][0])
console.log(startBoard[1][1])
console.log(startBoard[0][2])
console.log(startBoard[2][0])
console.log(startBoard[1][2])*/

//console.log(startBoard);

io.on('connection', function(socket){
  players.push(socket.id);
  var idnum = players.indexOf(socket.id);
  times.push(0);
  moves.push(0);
  if (moves.length == 2) {
    setInterval(timer, 1000);
  }
  io.emit('chat message', "Player " + (idnum + 1) + " has joined.");
  if (idnum % 2 == 1) {
    io.emit('chat message', "Game between Player " + idnum + " and Player " + (idnum + 1) + " has started.")
    moves[idnum - 1] = 1;
    games.push(startBoard);
  }
  //console.log(players);
  var num = players.indexOf(socket.id)
  console.log(times);
  console.log(moves);
  socket.on('chat message', function(msg){
    if (moves[num] != 0) {
      console.log(games[gameID][move[2]][move[3]]);
      games[gameID][move[3]][move[2]] = games[gameID][move[1]][move[0]];
      games[gameID][move[1]][move[0]] = '';
      console.log(games)
      moves[num] = 0;
      if (num % 2 == 0) {
        moves[num + 1] = 1;
        io.to(`${players[num + 1]}`).emit('chat message', "Your opponent has played " + msg);
      }
      else {
        moves[num - 1] = 1;
        io.to(`${players[num - 1]}`).emit('chat message', "Your opponent has played " + msg);
      }
    }
    console.log(players.indexOf(socket.id));
    var gamenum = "(Game: " + (Math.floor(players.indexOf(socket.id) / 2) + 1) + ") ";
    var time = "(Time Used: " + Math.floor(times[num]) + ") ";
    var mssg =  time + gamenum + "Player " + (players.indexOf(socket.id) + 1) + ": " + msg;
    io.emit('chat message', mssg);
    //io.to(socket.id).emit('chat message', 'test');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});