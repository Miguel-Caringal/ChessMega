var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var games = [];
var times = [];
var moves = [];

io.on('connection', function(socket){
  games.push(socket.id);
  var idnum = games.indexOf(socket.id);
  times.push(0);
  moves.push(0);
  io.emit('chat message', "Player " + (idnum + 1) + " has joined.");
  if (idnum % 2 == 1) {
    io.emit('chat message', "Game between Player " + idnum + " and Player " + (idnum + 1) + " has started.")
    moves[idnum - 1] = new Date();
  }
  var num = games.indexOf(socket.id)
  console.log(times);
  console.log(moves);

  io.to(socket.id).emit('initial information', idnum);

  socket.on('chat message', function(msg){
    if (moves[num] != 0) {
      times[num] += ((new Date()) - moves[num]);
      moves[num] = 0;
      if (num % 2 == 0) {
        moves[num + 1] = new Date();
        io.to(`${games[num + 1]}`).emit("Your opponent has played");
      }
      else {
        moves[num - 1] = new Date();
        io.to(`${games[num - 1]}`).emit("Your opponent has played");
      }
    }
    console.log(games.indexOf(socket.id));
    var gamenum = "(Game: " + (Math.floor(games.indexOf(socket.id) / 2) + 1) + ") ";
    var time = "(Time Used: " + (Math.floor(times[num] / 1000)) + ") ";
    var mssg =  time + gamenum + "Player " + (games.indexOf(socket.id) + 1) + ": " + msg;
    io.emit('chat message', mssg);
    io.to(socket.id).emit('chat message',"test");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
