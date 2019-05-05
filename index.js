var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var games = [];
var times = [];
var moves = [];

function timer() {
  for (var i = 0; i < moves.length; i++) {
    if (moves[i] == 1) {
      times[i] += 1;
    }
  }
}

io.on('connection', function(socket){
  games.push(socket.id);
  var idnum = games.indexOf(socket.id);
  times.push(0);
  moves.push(0);
  if (moves.length == 2) {
    setInterval(timer, 1000);
  }
  io.emit('chat message', "Player " + (idnum + 1) + " has joined.");
  if (idnum % 2 == 1) {
    io.emit('chat message', "Game between Player " + idnum + " and Player " + (idnum + 1) + " has started.")
    moves[idnum - 1] = 1;
  }
  //console.log(games);
  var num = games.indexOf(socket.id)
  console.log(times);
  console.log(moves);
  socket.on('chat message', function(msg){
    if (moves[num] != 0) {
      moves[num] = 0;
      if (num % 2 == 0) {
        moves[num + 1] = 1;
        io.to(`${games[num + 1]}`).emit('chat message', "Your opponent has played " + msg);
      }
      else {
        moves[num - 1] = 1;
        io.to(`${games[num - 1]}`).emit('chat message', "Your opponent has played " + msg);
      }
    }
    console.log(games.indexOf(socket.id));
    var gamenum = "(Game: " + (Math.floor(games.indexOf(socket.id) / 2) + 1) + ") ";
    var time = "(Time Used: " + Math.floor(times[num]) + ") ";
    var mssg =  time + gamenum + "Player " + (games.indexOf(socket.id) + 1) + ": " + msg;
    io.emit('chat message', mssg);
    //io.to(socket.id).emit('chat message', 'test');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});